using System;
using Pwa.Server.Domain.Entities.Contracts;

namespace Pwa.Server.Domain.Entities
{
    internal class Contact : EntityBase, IContact
    {
        public Contact()
            : base(Guid.NewGuid(), string.Empty)
        {
            IsNew = true;
        }

        public Contact(Guid id, string firstname, string lastname, string email)
            : base(id, firstname)
        {
            IsNew = false;
            LastName = lastname;
            EMail = email;
        }

        public bool IsNew { get; }

        public string FirstName => Name;

        public string LastName { get; }

        public string EMail { get; }
    }
}