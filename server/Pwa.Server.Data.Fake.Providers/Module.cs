using Microsoft.Extensions.DependencyInjection;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Infra;
using Solid.Practices.Modularity;

namespace Pwa.Server.Data.Fake.Providers
{
    public sealed class Module : ICompositionModule<IServiceCollection>
    {
        public void RegisterModule(IServiceCollection dependencyRegistrator)
        {
            dependencyRegistrator
                .AddSingleton<ILoginProvider, FakeLoginProvider>()
                .AddSingleton<IUsersProvider, FakeUsersProvider>()
                .AddSingleton<IRestClientData, RestClientData>();
        }

    }
}