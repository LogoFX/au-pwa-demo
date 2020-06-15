using Solid.Bootstrapping;
using Solid.Practices.Middleware;

namespace Pwa.Server.Infra
{
    public class RegisterRestClientMiddleware<TContract, TImplementation> : IMiddleware<IHaveRegistrator> 
        where TImplementation : class, TContract
        where TContract : IRestClient
    {
        public IHaveRegistrator Apply(IHaveRegistrator @object)
        {
            @object.Registrator.RegisterSingleton<TContract, TImplementation>();
            return @object;
        }
    }
}
