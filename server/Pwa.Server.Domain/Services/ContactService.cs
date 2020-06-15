using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using LogoFX.Client.Core;
using LogoFX.Core;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Domain.Entities;
using Pwa.Server.Domain.Entities.Contracts;

namespace Pwa.Server.Domain.Services
{
    public interface IContactService
    {
        IEnumerable<IContact> Items { get; }

        Task GetItems();

        Task<IContact> NewItem();

        Task SaveItem(IContact item);

        Task DeleteItem(IContact item);
    }

    [UsedImplicitly]
    internal sealed class ContactService : NotifyPropertyChangedBase<ContactService>, IContactService
    {
        private readonly IContactDataProvider _provider;

        private readonly RangeObservableCollection<IContact> _items =
            new RangeObservableCollection<IContact>();

        public ContactService(IContactDataProvider provider)
        {
            _provider = provider;
        }

        private void GetItems()
        {
            var items = _provider.GetItems().Select(x => x.ToEntity());
            _items.Clear();
            _items.AddRange(items);
        }

        IEnumerable<IContact> IContactService.Items => _items;

        Task IContactService.GetItems() => MethodRunner.RunAsync(GetItems);

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

        Task IContactService.DeleteItem(IContact item) => MethodRunner.RunAsync(() =>
        {
            _provider.DeleteItem(item.Id);
            _items.Remove(item);
        });
    }
}