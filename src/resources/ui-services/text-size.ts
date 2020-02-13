import * as d3 from 'd3';

/**
 * TextSize
 */
export class TextSize {
  public width: number = 0;
  public height: number = 0;
  public lineCount: number = 0;
}

export function textSize(text: string, oneLine: boolean = false): TextSize {
  if (!d3) {
    return undefined;
  }

  if (oneLine) {
    const container = d3.select('body').append('svg');
    container
      .append('text')
      .attr('x', -99999)
      .attr('y', -99999)
      .text(text);

    const size = container.node().getBBox();
    container.remove();

    return { width: size.width, height: size.height, lineCount: 1 };
  }

  const words = text.split(' ');

  if (words.length > 1) {
    const result = new TextSize();
    result.lineCount = words.length;
    for (const w of words) {
      const s = textSize(w, true);
      result.width = Math.max(result.width, s.width);
      result.height += s.height;
    }
    return result;
  }

  return textSize(text, true);
}
