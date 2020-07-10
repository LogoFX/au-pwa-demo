using System;
using LogoFX.Client.Core;
using Pwa.Server.Domain.Entities.Contracts;

namespace Pwa.Server.Domain.Entities
{
    public abstract class EntityBase : NotifyPropertyChangedBase<EntityBase>, IEntity
    {
        protected EntityBase(Guid id, string name)
        {
            Id = id;
            Name = name;
        }

        public Guid Id { get; }

        private string _name;

        public string Name
        {
            get => _name;
            protected set => SetProperty(ref _name, value);
        }
    }
}