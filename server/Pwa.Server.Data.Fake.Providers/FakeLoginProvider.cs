using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;

namespace Pwa.Server.Data.Fake.Providers
{
    internal sealed class FakeLoginProvider : ILoginProvider
    {
        public UserDto GetUser(string username, string password)
        {
            throw new System.NotImplementedException();
        }
    }
}