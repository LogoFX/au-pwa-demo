using System;
using System.Collections.Generic;
using System.Linq;
using Attest.Fake.Builders;
using Attest.Fake.Core;
using Attest.Fake.Setup.Contracts;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;

namespace Pwa.Server.Data.Fake.ProviderBuilders
{
    public sealed class ContactProviderBuilder : FakeBuilderBase<IContactDataProvider>.WithInitialSetup
    {
        private readonly List<ContactDto> _itemsStorage = new List<ContactDto>();

        private ContactProviderBuilder()
        {
        }

        public static ContactProviderBuilder CreateBuilder() => new ContactProviderBuilder();

        public void WithItems(IEnumerable<ContactDto> items)
        {
            _itemsStorage.Clear();
            _itemsStorage.AddRange(items);
        }

        protected override IServiceCall<IContactDataProvider> CreateServiceCall(
            IHaveNoMethods<IContactDataProvider> serviceCallTemplate) => serviceCallTemplate
            .AddMethodCallWithResult(t => t.GetItems(),
                r => r.Complete(GetItems))
            .AddMethodCallWithResult<Guid, ContactDto>(t => t.GetItem(It.IsAny<Guid>()),
                (r, id) => r.Complete(GetItem(id)))
            .AddMethodCallWithResult<Guid, bool>(t => t.DeleteItem(It.IsAny<Guid>()),
                (r, id) => r.Complete(DeleteItem(id)))
            .AddMethodCallWithResult<ContactDto, bool>(t => t.UpdateItem(It.IsAny<ContactDto>()),
                (r, dto) => r.Complete(k =>
                {
                    SaveItem(k);
                    return true;
                }))
            .AddMethodCall<ContactDto>(t => t.CreateItem(It.IsAny<ContactDto>()),
                (r, dto) => r.Complete(SaveItem));

        private ContactDto GetItem(Guid id) => _itemsStorage.Find(x => x.Id == id);

        private IEnumerable<ContactDto> GetItems() => _itemsStorage;

        private bool DeleteItem(Guid id)
        {
            var dto = _itemsStorage.SingleOrDefault(x => x.Id == id);
            return dto != null && _itemsStorage.Remove(dto);
        }

        private void SaveItem(ContactDto dto)
        {
            var oldDto = _itemsStorage.SingleOrDefault(x => x.Id == dto.Id);
            if (oldDto != null)
            {
                _itemsStorage.Remove(oldDto);
            }

            _itemsStorage.Add(dto);
        }
    }
}