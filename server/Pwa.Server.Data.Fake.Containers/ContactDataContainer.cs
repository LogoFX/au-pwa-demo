using System.Collections.Generic;
using Pwa.Server.Data.Contracts.Dto;

namespace Pwa.Server.Data.Fake.Containers
{
    public interface IContactDataContainer
    {
        IEnumerable<ContactDto> Items { get; }
    }

    public sealed class ContactDataContainer : IContactDataContainer
    {
        private readonly List<ContactDto> _items = new List<ContactDto>();
        public IEnumerable<ContactDto> Items => _items;

        public void UpdateItems(IEnumerable<ContactDto> items)
        {
            _items.Clear();
            _items.AddRange(items);
        }
    }
}