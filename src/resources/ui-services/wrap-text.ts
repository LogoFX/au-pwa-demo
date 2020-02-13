import * as d3 from 'd3';
import { textSize, TextSize } from './text-size';

export function wrapText(selection: d3.Selection<SVGTextElement, string, d3.BaseType, unknown>, namesOnTop: boolean, sin: number, cos: number): void {
  selection.each((d, i, nodes) => {

    const node = nodes[i];

    let kx = 0;
    let ky = 0;
    let tg = 0;
    if (cos < 1 && cos > 0) {
      tg = sin / cos;
      if (tg > 1) {
        tg = 1 / tg;
      }
    }

    const strList = d.split(' ');
    if (!namesOnTop && strList.length === 0) {
      return;
    }

    const sizes: { [index: string]: TextSize } = { };
    let maxWidth = 0;
    for (const str of strList) {
      sizes[str] = textSize(str);
      maxWidth = Math.max(sizes[str].width, maxWidth);
    }

    let innerHtml: string = '';

    let index = 0;
    for (const str of strList) {
      const size = sizes[str];
      if (!namesOnTop && sin !== 0) {
        if (index === 0) {
          kx = -maxWidth - size.height * cos;
        } else {
          kx += size.height * cos;
          kx += size.height * tg;
          if (size.width === maxWidth) {
            kx -= size.width - sizes[strList[0]].width;
          }
        }

        kx += maxWidth - size.width;
      }

      innerHtml += `<tspan dx='${kx}' dy='${ky}'>${str}</tspan>`;
      ky += size.height;
      if (namesOnTop) {
        kx -= size.width - size.height * tg;
      } else if (sin === 0) {
        kx -= size.width;
      }
      ++index;
    }

    // tslint:disable-next-line: no-inner-html
    node.innerHTML = innerHtml;
  });
}

export function wrapTextSimple<T>(selection: d3.Selection<SVGTextElement, T, d3.BaseType, unknown>, func: (arg: T) => string, maxTextWidth?: number): number {
  selection.each((d, i, nodes) => {

    const node = nodes[i];

    let kx = 0;
    let ky = 0;

    const strList = func(d).split(' ');

    const sizes: { [index: string]: TextSize } = { };
    let maxWidth = 0;
    for (const str of strList) {
      sizes[str] = textSize(str);
      maxWidth = Math.max(sizes[str].width, maxWidth);
    }

    let innerHtml: string = '';

    for (const str of strList) {
      const size = sizes[str];
      let s = str;
      let showTooltip: boolean = false;
      let deltaWidth = size.width;
      if (maxTextWidth && size.width > maxTextWidth) {
        const avgWidth = size.width / s.length;
        const maxLength = Math.trunc(maxTextWidth / avgWidth) - 1;
        s = s.substring(0, maxLength);
        s += "…";
        showTooltip = true;
        deltaWidth = textSize(s).width;
      }
      if (showTooltip) {
        innerHtml += `<tspan title="${str}" dx="${kx}" dy="${ky}">${s}</tspan>`;
      } else {
        innerHtml += `<tspan dx='${kx}' dy='${ky}'>${s}</tspan>`;
      }
      ky += size.height;
      kx -= deltaWidth;
    }

    // tslint:disable-next-line: no-inner-html
    node.innerHTML = innerHtml;
  });

  return 0;
}
