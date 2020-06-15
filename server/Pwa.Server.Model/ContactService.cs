using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using LogoFX.Client.Core;
using LogoFX.Core;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Model.Contracts;
using Pwa.Server.Model.Mappers;

namespace Pwa.Server.Model
{
    [UsedImplicitly]
    internal sealed class ContactService : NotifyPropertyChangedBase<ContactService>, IContactService
    {
        private readonly IContactDataProvider _provider;
        private readonly ContactMapper _mapper;

        private readonly RangeObservableCollection<IContact> _items =
            new RangeObservableCollection<IContact>();

        public ContactService(IContactDataProvider provider, ContactMapper mapper)
        {
            _provider = provider;
            _mapper = mapper;
        }

        private void GetItems()
        {
            var items = _provider.GetItems().Select(_mapper.MapToContact);
            _items.Clear();
            _items.AddRange(items);
        }

        IEnumerable<IContact> IContactService.Items => _items;

        Task IContactService.GetItems() => MethodRunner.RunAsync(GetItems);

        Task<IContact> IContactService.NewItem() => MethodRunner.RunWithResultAsync<IContact>(() => new Contact());

        Task IContactService.SaveItem(IContact item) => MethodRunner.RunAsync(() =>
        {
            var dto = _mapper.MapFromContact(item);

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