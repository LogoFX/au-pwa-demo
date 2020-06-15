using System.IO;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.OpenApi.Models;
using Solid.Practices.Modularity;

namespace Pwa.Server.Api
{
    /// <inheritdoc />
    public sealed class Module : ICompositionModule<IServiceCollection>
    {
        /// <inheritdoc />
        public void RegisterModule(IServiceCollection dependencyRegistrator) => dependencyRegistrator.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo {Title = "My API", Version = "v1"});
            var basePath = PlatformServices.Default.Application.ApplicationBasePath;
            var xmlPath = Path.Combine(basePath, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml");
            c.IncludeXmlComments(xmlPath);
        });
    }
}