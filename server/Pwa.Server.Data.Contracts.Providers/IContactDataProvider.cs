using System;
using System.Collections.Generic;
using Pwa.Server.Data.Contracts.Dto;

namespace Pwa.Server.Data.Contracts.Providers
{
    public interface IContactDataProvider
    {
        IEnumerable<ContactDto> GetItems();

        ContactDto GetItem(Guid id);

        bool DeleteItem(Guid id);

        bool UpdateItem(ContactDto dto);

        void CreateItem(ContactDto dto);
    }
}