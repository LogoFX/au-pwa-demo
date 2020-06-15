namespace Pwa.Server.Domain.Entities.Contracts
{
    public interface IContact : IEntity
    {
        bool IsNew { get; }

        string FirstName { get; }

        string LastName { get; }

        string EMail { get; }
    }
}