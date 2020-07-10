namespace Pwa.Server.Domain.Entities.Contracts
{
    public interface IContact : IEntity
    {
        bool IsNew { get; }

        string FirstName { get; set; }

        string LastName { get; set; }

        string EMail { get; set; }
    }
}