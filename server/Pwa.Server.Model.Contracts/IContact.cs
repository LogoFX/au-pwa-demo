namespace Pwa.Server.Model.Contracts
{
    public interface IContact : IAppModel
    {
        string DisplayName { get; }

        int Value { get; set; }
    }
}