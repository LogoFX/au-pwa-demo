using System;
using System.Collections.Generic;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;

namespace Pwa.Server.Data.Real.Providers
{
    //TODO: Use explicit implementation
    internal sealed class ContactDataProvider : IContactDataProvider
    {
        public IEnumerable<ContactDto> GetItems()
        {
            throw new NotImplementedException();
        }

        public bool DeleteItem(Guid id)
        {
            throw new NotImplementedException();
        }

        public bool UpdateItem(ContactDto dto)
        {
            throw new NotImplementedException();
        }

        public void CreateItem(ContactDto dto)
        {
            throw new NotImplementedException();
        }
    }
}