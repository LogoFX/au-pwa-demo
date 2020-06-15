using System;
using Pwa.Server.Data.Contracts.Dto;

namespace Pwa.Server.Data.Contracts.Providers
{
    public interface IContactsProvider
    {
        ContactDto[] GetContacts();

        ContactDto AddContact(string firstName, string lastName, string eMail);

        bool RemoveContact(Guid id);

        ContactDto UpdateContact(Guid id, string firstName, string lastName, string eMail);
    }
}