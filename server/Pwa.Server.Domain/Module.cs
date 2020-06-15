using JetBrains.Annotations;
using Microsoft.Extensions.DependencyInjection;
using Pwa.Server.Domain.Services;
using Solid.Practices.Modularity;

namespace Pwa.Server.Domain
{
    [UsedImplicitly]
    internal sealed class Module : ICompositionModule<IServiceCollection>
    {
        public void RegisterModule(IServiceCollection dependencyRegistrator)
        {
            dependencyRegistrator
                .AddSingleton<IUsersService, UsersService>()
                .AddSingleton<IContactService, ContactService>();
        }
    }
}
