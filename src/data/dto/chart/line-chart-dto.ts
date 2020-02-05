import { LineChartValueDto } from "./line-chart-value-dto";

/**
 * LineChartDto
 */
export class LineChartDto {
  public title: string;
  public indicator: string;
  public columns: string[] = [];
  public dates: Date[];
  public series: LineChartValueDto[];
}
