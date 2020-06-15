namespace Pwa.Server.Domain.Entities.Contracts
{
    public interface IUser : IEntity
    {
        string Fullname { get; }
    }
}