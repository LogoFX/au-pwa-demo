using Microsoft.Extensions.DependencyInjection;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Infra;
using Solid.Bootstrapping;
using Solid.Practices.Middleware;

namespace Pwa.Server.Services.Sdk
{
    public class RegisterDataMiddleware : IMiddleware<IHaveRegistrator<IServiceCollection>>
    {
        IHaveRegistrator<IServiceCollection> IMiddleware<IHaveRegistrator<IServiceCollection>>.Apply(IHaveRegistrator<IServiceCollection> @object)
        {
            @object.Registrator
                //TODO Move to auth middleware as soon as auth gets its own endpoint
                .AddSingleton<ILoginProvider, LoginProxy>()
                .AddSingleton<IRestClientData, RestClientData>();
            return @object;
        }
    }
}