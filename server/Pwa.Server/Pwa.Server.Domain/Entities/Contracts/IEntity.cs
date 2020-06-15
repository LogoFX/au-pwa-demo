using System;

namespace Pwa.Server.Domain.Entities.Contracts
{
    public interface IEntity
    {
        Guid Id { get; }

        string Name { get; }
    }
}