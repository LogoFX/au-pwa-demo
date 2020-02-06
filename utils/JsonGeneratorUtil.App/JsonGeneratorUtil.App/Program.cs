using System;
using System.Collections.Generic;
using JsonGeneratorUtil.App.Models;

namespace JsonGeneratorUtil.App
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            var prismList = new List<Prism>();
            prismList.Add(new Prism
            {
              id = "All",
              name = "All",
              heatmap = new Heatmap
              {
                id = "Topics Heatmap",
                name = "Topics Heatmap",
                dataSourceUri = "/topics-matrix/all/{reservoir}/{measure}/{time-resolution}",
                relatedData = new[]
                {
                  new RelatedData
                  {

                  }
                }
              }
            });
        }
    }
}
