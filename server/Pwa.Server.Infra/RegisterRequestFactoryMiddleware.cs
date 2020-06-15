using Microsoft.Extensions.DependencyInjection;
using Solid.Bootstrapping;
using Solid.Practices.IoC;
using Solid.Practices.Middleware;

namespace Pwa.Server.Infra
{
    public class RegisterRequestFactoryMiddleware : IMiddleware<IHaveRegistrator<IServiceCollection>>, IMiddleware<IHaveRegistrator>
    {
        IHaveRegistrator<IServiceCollection> IMiddleware<IHaveRegistrator<IServiceCollection>>.Apply(
            IHaveRegistrator<IServiceCollection> @object)
        {
            @object.Registrator.AddSingleton<IRequestFactory, RestRequestFactory>();
            return @object;
        }

        public IHaveRegistrator Apply(IHaveRegistrator @object)
        {
            @object.Registrator.AddSingleton<IRequestFactory, RestRequestFactory>();
            return @object;
        }
    }
}