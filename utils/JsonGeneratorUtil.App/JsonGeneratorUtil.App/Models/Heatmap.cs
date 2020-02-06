namespace JsonGeneratorUtil.App.Models
{
  public sealed class Heatmap
  {
    public string id { get; set; }

    public string name { get; set; }

    public string dataSourceUri { get; set; }

    public RelatedData[] relatedData { get; set; }
  }
}