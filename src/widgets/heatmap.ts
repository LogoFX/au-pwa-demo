import { EventAggregator } from 'aurelia-event-aggregator';
import { ViewModelCreatorService, WrappingCollection, ObjectViewModel, IModel } from 'logofx';
import moment, { Moment } from 'moment';
import { View, transient, autoinject, bindable } from 'aurelia-framework';
import * as d3 from 'd3';
import { DataService, IHeatmap, IPrismDefinition} from 'model';
import { bindingMode, observable } from 'aurelia-binding';
import { Router } from 'aurelia-router';
import { textSize, TextSize, wrapText } from 'resources/ui-services';
import { HttpResponseMessage } from 'aurelia-http-client';
import { formatDate } from 'shared';
import { ResizeSensor } from 'css-element-queries';

/**
 * The Heatmap view model.
 */
@transient(Heatmap)
export class Heatmap extends ObjectViewModel<IPrismDefinition> {

  public title: string = String.empty;

  public site: HTMLElement;
  public _heatmap: IHeatmap;

  public _heatmapWidth: number;
  public _heatmapHeight: number;

  @observable
  public namesOnTop: boolean = true;

  public isRisk: boolean;

  private _loadHeatmapRequested: boolean = false;

  private _svg: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _g: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _axisX: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _axisY: d3.Selection<SVGGElement, unknown, null, undefined>;
  private _tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>;
  private _prevAxisX: d3.ScaleBand<any>;
  private _prevAxisY: d3.ScaleBand<any>;

  private _dataRequestCounter: number = 0;

  // tslint:disable: no-parameter-properties
  constructor(model: IPrismDefinition,
              private viewModelCreatorService: ViewModelCreatorService,
              private dataService: DataService,
              private eventAgregator: EventAggregator,
              private router: Router) {
    super(model);
  }

  public divResize(detail: {width: number; height: number}): void {
    const width = detail.width;
    const height = detail.height;
    this.updateSvg(width, height);
    this.updateHeatmapSize(width, height);
    this.updateData();
  }

  public attached(): void {

    this.site = document.getElementById("site");

    const resizeDiv = document.getElementById("resizeDiv");
    const rs = new ResizeSensor(resizeDiv, (detail: {width: number; height: number}) => {
      this.divResize(detail);
    });
  }

  private namesOnTopChanged(): void {
    this.updateHeatmapSize(this._heatmapWidth, this._heatmapHeight);
  }

  private cleanHeatmap(): void {
    this.site = document.getElementById("site");
    this._svg = d3.select(this.site).select("svg");
    const base = this._svg.select(".base");
    base.selectAll(".bar")
      .remove();

    base.selectAll(".name")
      .remove();

    base.selectAll(".row")
      .remove();

    this._heatmap = null;
  }

  private changeNamesAlign(): void {
    this.namesOnTop = !this.namesOnTop;
  }

  private updateCommon(): {
     names: d3.Selection<d3.BaseType, string, d3.BaseType, unknown>;
     rows: d3.Selection<d3.BaseType, string, d3.BaseType, unknown>;
     bars: d3.Selection<d3.BaseType, {XLabel: string; YLabel: string; Value: number}, d3.BaseType, unknown>;
     x: d3.ScaleBand<string>;
     y: d3.ScaleBand<string>;
     myColor: d3.ScaleLinear<number, number>;
     sin: number;
     cos: number;
     nameX(d: string): number;
     nameY(d: string): number;
     nameTransform(d: string): string;
     rowX(d: string): number;
     rowY(d: string): number;
  } {

    this.site = document.getElementById("site");
    this._svg = d3.select(this.site).select("svg");
    const base = this._svg.select(".base");
    const axisX =  this._svg.select(".axis-x");
    const axisY =  this._svg.select(".axis-y");
    const bars = base.selectAll(".bar").data(this._heatmap.values);
    const names = axisX.selectAll(".name").data(this._heatmap.axisXLabels);
    const rows = axisY.selectAll(".row").data(this._heatmap.axisYLabels);

    let maxWidthOfLabel = 0;
    this._heatmap.axisYLabels.forEach(row => {
      const size = textSize(row, true);
      maxWidthOfLabel = Math.max(maxWidthOfLabel, size.width);
    });

    let hw = this._heatmapWidth - this._heatmap.axisXLabels.length * 0.5;
    //hw = Math.trunc(hw / this._heatmap.axisXLabels.length) * this._heatmap.axisXLabels.length;

    const x: d3.ScaleBand<string> = d3.scaleBand()
      .domain(this._heatmap.axisXLabels)
      .range([maxWidthOfLabel, hw])
      .padding(0.01);

    let maxNameWidth = 0;
    let maxNameHeight = 0;
    let maxLineCount = 0;
    const nameSizes: {[id: string]: TextSize} = { };
    this._heatmap.axisXLabels.forEach(name => {
      //const html = this.textToHtml(name);
      const size = textSize(name);
      nameSizes[name] = size;
      maxNameWidth = Math.max(maxNameWidth, size.width);
      maxNameHeight = Math.max(maxNameHeight, size.height);
      maxLineCount = Math.max(maxLineCount, size.lineCount);
    });

    let alpha = 0;
    let projectionNameLength = maxNameWidth;
    while (projectionNameLength > x.bandwidth() && alpha > -90) {
      alpha -= 1;
      projectionNameLength = maxNameWidth * Math.cos(-alpha * Math.PI / 180) + maxNameHeight * Math.sin(-alpha * Math.PI / 180);
    }

    const sin = Math.sin(-alpha * Math.PI / 180);
    const cos = Math.cos(-alpha * Math.PI / 180);

    const mw1 = maxNameWidth * cos + maxNameHeight * sin;
    const mh1 = maxNameHeight * cos + maxNameWidth * sin;
    maxNameWidth = mw1;
    maxNameHeight = mh1;

    this._heatmap.axisXLabels.forEach(name => {
      const size = nameSizes[name];
      const width = size.width * cos + size.height * sin;
      const height = size.height * cos + size.width * sin;
      size.width = width;
      size.height = height;
    });

    const maxHeightOfLabel = maxNameHeight;

    let axisRange: [number, number];
    if (this.namesOnTop) {
      axisRange = [maxHeightOfLabel, this._heatmapHeight];
    } else {
      axisRange = [0, this._heatmapHeight - maxHeightOfLabel];
    }

    const y: d3.ScaleBand<string> = d3.scaleBand()
      .domain(this._heatmap.axisYLabels)
      .range(axisRange)
      .padding(0.01);

    // Build color scale
    const min = d3.min(this._heatmap.values, v => v.Value);
    const max = d3.max(this._heatmap.values, v => v.Value);
    const myColor = d3.scaleLinear()
      .range([<any>"#5499c4", "#7ebae0", "#d9f0ff", "#FFFFFF", "#fa948e", "#e0534c", "#b82a23"])
      .domain([min, -1, -0.1, 0, 0.1, 1, max]);

    const nameX = (d: string) => {
      if (!this.namesOnTop && alpha !== 0) {
        return x(d) + x.bandwidth() / 2;
      }

      let result = x(d) + x.bandwidth() / 2;
      if (!this.namesOnTop || alpha === 0) {
        result -= nameSizes[d].width / 2;
      }
      return result;
    };

    const nameY = (d: string) => {
      if (this.namesOnTop) {
        if (alpha === 0) {
          return maxNameHeight / maxLineCount + maxNameHeight - nameSizes[d].height - 4;
        }

        return maxNameHeight - 4;
      }

      if (alpha === 0) {
        return this._heatmapHeight - maxNameHeight + maxNameHeight / maxLineCount - 2;
      }

      return this._heatmapHeight - maxNameHeight;
    };

    const nameTransform = (d: string) => {
      return `rotate(${alpha})`;
    };

    const rowX = (d: string) => {
      // tslint:disable-next-line: no-unnecessary-local-variable
      const result = maxWidthOfLabel - 4;
      return result;
    };

    const rowY = (d: string) => {
      // tslint:disable-next-line: no-unnecessary-local-variable
      const result = y(d) + y.bandwidth() / 2 + 4;
      return result;
    };

    return {names, rows, bars, x, y, myColor, sin, cos, nameX, nameY, nameTransform, rowX, rowY};
  }

  private updateHeatmapSize(width?: number, height?: number): void {
    if (width > 0) {
      this._heatmapWidth = width;
    }

    if (height > 0) {
      this._heatmapHeight = height;
    }

    if (!this._heatmap) {
      return;
    }

    const r = this.updateCommon();

    r.names
      .transition()
      .duration(150)
      .attr('transform', d => `translate(${r.nameX(d)}, ${r.nameY(d)}) ${r.nameTransform(d)}`)
      .call(<any>wrapText, this.namesOnTop, r.sin, r.cos);

    r.rows
      .transition()
      .duration(150)
      .attr('x', d => r.rowX(d))
      .attr('y', d => r.rowY(d));

    r.bars
      .transition()
      .duration(150)
      .attr("width", () => r.x.bandwidth())
      .attr("height", () => r.y.bandwidth())
      .style("fill", d => r.myColor(d.Value))
      .attr('x', d => r.x(d.XLabel))
      .attr('y', d => r.y(d.YLabel));
  }

  private setEventHandlersForBars<T extends d3.BaseType>(sel: d3.Selection<T, {XLabel: string; YLabel: string; Value: number}, d3.BaseType, unknown>): d3.Selection<T, {XLabel: string; YLabel: string; Value: number}, d3.BaseType, unknown> {
    return sel
      .on("click", (d, n) => {
      // tslint:disable-next-line: no-floating-promises
      //this.updateCharts(d.YLabel, d.XLabel);
      })
      .on("mouseover", (d, n) => {

       const row = this._heatmap.axisYLabels.indexOf(d.YLabel);
       const col = this._heatmap.axisXLabels.indexOf(d.XLabel);

       d3.select(`.row-index${row}`)
         .attr('font-weight', 'bold');
       d3.select(`.name-index${col}`)
         .attr('font-weight', 'bold');
       d3.select(`.index${n}`).style("opacity", "1");

       const barRect = (d3.select(`.index${n}`)
         .node() as HTMLElement)
         .getBoundingClientRect();

       const siteRect = d3.select(this.site)
         .node()
         .getBoundingClientRect();

       this._tooltip
          .html(`
                <div class="tooltip-wrapper" style="position: relative">
                    ${d.XLabel} and ${d.YLabel} <br> value: ${d.Value.toFixed(3)}
                </div>
                <div class="tooltip-arrow"></div>`)
          .style("pointer-events", "none"); // Stop interferring with cursor;

       const tooltipRect = this._tooltip
          .node()
          .getBoundingClientRect();

       let fluidPosition = 'top';

       const tooltipSettings = {
         offsetTop: 6,
         offsetLeft: 6
       };

       const tooltipPosition = {
         left: barRect.left - siteRect.left + (barRect.width / 2) - (tooltipRect.width / 2),
         top: barRect.top - siteRect.top,
         height: tooltipRect.height,
         width: tooltipRect.width
       };

       if (tooltipPosition.left < barRect.width + tooltipSettings.offsetLeft) {
         fluidPosition = 'right';
         tooltipPosition.top += barRect.height / 2 - tooltipPosition.height / 2;
         tooltipPosition.left += barRect.width / 2 + tooltipSettings.offsetLeft + tooltipPosition.width / 2;
       }

       if (tooltipPosition.left + tooltipRect.width > siteRect.width) {
        fluidPosition = 'left';
        tooltipPosition.top += barRect.height / 2 - tooltipPosition.height / 2;
        tooltipPosition.left -= barRect.width / 2 + tooltipSettings.offsetLeft + tooltipPosition.width / 2;
       }

       if (tooltipPosition.top < tooltipPosition.height + tooltipSettings.offsetTop * 4) {
         if (fluidPosition === 'right' || fluidPosition === 'left') {
           //fluidPosition = 'right-bottom';
         } else {
          tooltipPosition.top += tooltipSettings.offsetTop + barRect.height;
          fluidPosition = 'bottom';
         }
       }

      if (fluidPosition === 'top') {
         tooltipPosition.top += -tooltipRect.height - tooltipSettings.offsetTop;
       }

       this._tooltip
          .attr('class', `tooltip tooltip-position--${fluidPosition}`)
          .style("left", `${tooltipPosition.left}px`)
          .style("top", `${tooltipPosition.top}px`);

       this._tooltip
         .transition()
         .style("opacity", 1);
      })
      .on("mouseout", (d, n) => {

       const row = this._heatmap.axisYLabels.indexOf(d.YLabel);
       const col = this._heatmap.axisXLabels.indexOf(d.XLabel);

       d3.select(`.index${n}`).style("opacity", "0.8");
       d3.select(`.row-index${row}`)
         .attr('font-weight', 'normal');
       d3.select(`.name-index${col}`)
         .attr('font-weight', 'normal');
       this._tooltip
         .style("opacity", 0);
      });
  }

  private updateData(): void {

    const heatmap = this._heatmap;

    if (!heatmap) {
      return;
    }

    const r = this.updateCommon();

    const topicClickable = this.model.heatmap.relatedData.filter(x => x.slice === "topic" && x.items && x.items.length > 0).length > 0;
    const symbolClickable = this.model.heatmap.relatedData.filter(x => x.slice === "symbol" && x.items && x.items.length > 0).length > 0;
    const valueClickable = this.model.heatmap.relatedData.filter(x => x.slice === "value" && x.items && x.items.length > 0).length > 0;

    r.names
      .enter()
      .append("text")
        .attr("class", (d, n) => `name name-index${n}${symbolClickable ? " name-pointer" : ""}`)
        //.attr("text-anchor", "middle")
        .on("click", (d, n) => {
          if (symbolClickable) {
            // tslint:disable-next-line: no-floating-promises
            //this.updateCharts(null, d);
          }
        })
        .merge(r.names as any)
        .text(d => d)
        .attr('transform', d => `translate(${r.nameX(d)}, ${r.nameY(d)}) ${r.nameTransform(d)}`)
        .call(wrapText, this.namesOnTop, r.sin, r.cos)
        .on("mouseover", function (d) {
            d3.select(this)
              .attr('font-weight', 'bold');
            })
        .on("mouseout", function (d) {
            d3.select(this)
              .attr('font-weight', 'normal');
            });

    r.names.exit().remove();

    r.rows
      .enter()
      .append("text")
      .attr("class", (d, n) => `row row-index${n}${topicClickable ? " row-pointer" : ""}`)
      .attr("text-anchor", "end")
      .on("click", (d, n) => {
        if (topicClickable) {
          // tslint:disable-next-line: no-floating-promises
          //this.updateCharts(d, null);
        }
      })
      .merge(r.rows as any)
      .attr('x', d => r.rowX(d))
      .attr('y', d => r.rowY(d))
      .text(d => d)
      .on("mouseover", function (d) {
          d3.select(this)
            .attr('font-weight', 'bold');
          })
      .on("mouseout", function (d) {
          d3.select(this)
            .attr('font-weight', 'normal');
          });

    r.rows.exit().remove();

    this.setEventHandlersForBars(r.bars
      .enter()
      .append("rect")
      .attr("class", (d, n) => `bar index${n}${valueClickable ? " value-pointer" : ""}`))
      .merge(r.bars as any)
      .style("opacity", 0.8)
      .attr("width", () => r.x.bandwidth())
      .attr("height", () => r.y.bandwidth())
      .style("fill", d => r.myColor(d.Value))
      .attr('x', d => this._prevAxisX ? this._prevAxisX(d.XLabel) : r.x(d.XLabel))
      .attr('y', d => this._prevAxisY ? this._prevAxisY(d.YLabel) : r.y(d.YLabel))
      .transition()
      .duration(1000)
      .attr('x', d => r.x(d.XLabel))
      .attr('y', d => r.y(d.YLabel));

    r.bars.exit().remove();

    this._prevAxisY = r.y;
    this._prevAxisX = r.x;

    this.setEventHandlersForBars(r.bars);
  }

  private loadHeatmap(reloadData: boolean): void {
    if (!reloadData) {
      this.loadHeatmapRealy(reloadData);
      return;
    }

    if (this.isBusy) {
      this._loadHeatmapRequested = true;
      return;
    }

    this._loadHeatmapRequested = false;

    ++this._dataRequestCounter;
    setTimeout(() => {
      --this._dataRequestCounter;
      if (this._dataRequestCounter === 0) {
        this.loadHeatmapRealy(reloadData);
      }
    },         500);
  }

  private async loadHeatmapRealy(reloadData: boolean): Promise<void> {

    if (this.isBusy) {
      throw new Error('LoadHeatmap: already busy');
    }

    this.isBusy = true;

    try {
      await this.initHeatmap(reloadData);
      this.updateData();
    } finally {
      this.isBusy = false;
      if (this._loadHeatmapRequested) {
        this.loadHeatmap(reloadData);
      }
    }
  }

  private async initHeatmap(reloadData: boolean): Promise<void> {
    try {

      this._heatmap = await this.dataService.getHeatmap(this.model.id);

    } catch (error) {
      this.cleanHeatmap();
      if (error instanceof HttpResponseMessage) {
        if (error.statusCode === 404) {
          alert("Data not found.");
        } else {
          alert(`Error Code: ${error.statusCode}, ${error.content}`);
        }
      } else {
        alert(error);
      }
    }
  }

  private updateSvg(clientWidth: number, clientHeight: number): void {
    const margin = {top: 5, right: 12, bottom: 5, left: 5};

    if (!this.site) {
      return;
    }

    const width: number = clientWidth - margin.left - margin.right;
    const height: number = clientHeight - margin.top - margin.bottom;

    d3.select(this.site)
      .style("width", `${clientWidth}px`)
      .style("height", `${clientHeight}px`);

    if (this._svg === undefined) {
      this._svg = d3.select(this.site).append("svg");
      this._g = this._svg
        .append("g")
        .attr('class', 'base')
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
      this._axisX = this._g
        .append("g")
        .attr("class", "axis-x");
      this._axisY = this._g
        .append("g")
        .attr("class", "axis-y");

      this._tooltip =
         d3.select(this.site)
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "1px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style("position", "absolute")
          .style("max-width", "220px")
          .style("z-index", "99");
      this._g.on('mouseout', () => {
        this._tooltip
          .style('left', '-200px')
          .style('top', '-200px')
          .style('opacity', 0);
      });
    }

    this._svg.attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom);

    if (this._axisX) {
      this._axisX.attr("transform", `translate(0, 0)`);
    }
  }

  private hasClass(el: Element, className: string): boolean {
    if (el.classList) return el.classList.contains(className);
    else return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
  }

  private addClass(el: Element, className: string): void {
    if (el.classList) el.classList.add(className);
    else if (!this.hasClass(el, className)) el.className += ` ${className}`;
  }

  private removeClass(el: Element, className: string): void {
      if (el.classList) el.classList.remove(className);
      else if (this.hasClass(el, className)) {
        const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
        el.className = el.className.replace(reg, ' ');
      }
  }

  private initPanel(panelTriggers: HTMLCollectionOf<Element>, i: number): void {
    const panelClass = `js-cd-panel-${panelTriggers[i].getAttribute('data-panel')}`;
    const panel = document.getElementsByClassName(panelClass)[0];
    // open panel when clicking on trigger btn
    panelTriggers[i].addEventListener('click', (event) => {
      event.preventDefault();
      this.addClass(panel, 'cd-panel--is-visible');
    });
    //close panel when clicking on 'x' or outside the panel
    panel.addEventListener('click', (event: any) => {
      if (this.hasClass(event.target, 'js-cd-close') || this.hasClass(event.target, panelClass)) {
        event.preventDefault();
        this.removeClass(panel, 'cd-panel--is-visible');
      }
    });
  }

  private scrollToChartArea(id: string): void {
    const chartArea = document.getElementById(id);
    const offsetTop = chartArea.offsetTop;
    const element = document.getElementsByTagName('main')[0];
    element.scroll({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}
