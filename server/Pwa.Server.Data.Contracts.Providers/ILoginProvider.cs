using Pwa.Server.Data.Contracts.Dto;

namespace Pwa.Server.Data.Contracts.Providers
{
    public interface ILoginProvider
    {
        UserDto GetUser(string username, string password);
    }
}