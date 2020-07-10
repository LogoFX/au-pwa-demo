using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using LogoFX.Client.Core;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Domain.Entities;
using Pwa.Server.Domain.Entities.Contracts;

namespace Pwa.Server.Domain.Services
{
    public interface IContactService
    {
        Task<IEnumerable<IContact>> GetItems();

        Task<IContact> GetItem(Guid id);

        Task<IContact> NewItem();

        Task SaveItem(IContact item);

        Task<bool> DeleteItem(IContact item);
    }

    [UsedImplicitly]
    internal sealed class ContactService : NotifyPropertyChangedBase<ContactService>, IContactService
    {
        private readonly IContactDataProvider _provider;

        public ContactService(IContactDataProvider provider)
        {
            _provider = provider;
        }

        private IEnumerable<IContact> GetItems() => _provider.GetItems().Select(x => x.ToEntity());

        private IContact GetItem(Guid id) => _provider.GetItem(id).ToEntity();

        Task<IContact> IContactService.GetItem(Guid id) => MethodRunner.RunWithResultAsync(() => GetItem(id));

        Task<IEnumerable<IContact>> IContactService.GetItems() => MethodRunner.RunWithResultAsync(GetItems);

        Task<IContact> IContactService.NewItem() => MethodRunner.RunWithResultAsync<IContact>(() => new Contact());

        Task IContactService.SaveItem(IContact item) => MethodRunner.RunAsync(() =>
        {
            var dto = item.ToDto();

            if (item.IsNew)
            {
                _provider.CreateItem(dto);
            }
            else
            {
                _provider.UpdateItem(dto);
            }
        });

        Task<bool> IContactService.DeleteItem(IContact item) => MethodRunner.RunWithResultAsync(() => _provider.DeleteItem(item.Id));
    }
}