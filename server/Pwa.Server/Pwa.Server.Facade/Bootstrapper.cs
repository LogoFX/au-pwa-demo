using LogoFX.Server.Bootstrapping;
using Microsoft.Extensions.DependencyInjection;
using Solid.Practices.Composition;

namespace Pwa.Server.Facade
{
    internal sealed class Bootstrapper : BootstrapperBase
    {
        public Bootstrapper(IServiceCollection dependencyRegistrator)
            : base(dependencyRegistrator)
        {
        }

        public override CompositionOptions CompositionOptions => new CompositionOptions
        {
            Prefixes = new[]
            {
                "Pwa.Server.Facade",
                "Pwa.Server.Api",
                "Pwa.Server.Domain",
                "Pwa.Server.Data",
                "Pwa.Server.Infra"
            }
        };
    }
}