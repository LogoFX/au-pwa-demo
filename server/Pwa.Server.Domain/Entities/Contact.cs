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

        public string FirstName
        {
            get => Name;
            set => Name = value;
        }

        private string _lastName;

        public string LastName
        {
            get => _lastName;
            set => SetProperty(ref _lastName, value);
        }

        private string _eMail;

        public string EMail
        {
            get => _eMail;
            set => SetProperty(ref _eMail, value);
        }
    }
}