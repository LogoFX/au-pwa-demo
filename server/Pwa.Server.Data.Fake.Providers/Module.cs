using System;
using Microsoft.Extensions.DependencyInjection;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Data.Fake.Containers;
using Pwa.Server.Data.Fake.ProviderBuilders;
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
            dependencyRegistrator
                .AddTransient(sp => InitializeContactContainer())
                .AddSingleton<IContactDataProvider, FakeContactDataProvider>();
            dependencyRegistrator.AddTransient(sp => ContactProviderBuilder.CreateBuilder());
        }

        private IContactDataContainer InitializeContactContainer()
        {
            var container = new ContactDataContainer();
            container.UpdateItems(new[]
            {
                new ContactDto
                {
                    Id = Guid.NewGuid(),
                    FirstName = "John",
                    LastName = "Dow",
                    EMail = "john@mail.com"
                }
            });
            return container;
        }
    }
}