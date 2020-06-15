using System;
using Pwa.Server.Domain.Entities.Contracts;

namespace Pwa.Server.Domain.Entities
{
    public sealed class User : EntityBase, IUser
    {
        public User(Guid id, string name, string fullname)
            : base(id, name)
        {
            Fullname = fullname;
        }

        public string Fullname { get; }
    }
}