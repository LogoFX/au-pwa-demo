using System.Collections.Generic;
using System.Security.Authentication;
using Attest.Fake.Builders;
using Attest.Fake.Core;
using Attest.Fake.Setup.Contracts;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;

namespace Pwa.Server.Data.Fake.ProviderBuilders
{
    public class LoginProviderBuilder : FakeBuilderBase<ILoginProvider>.WithInitialSetup
    {
        private readonly Dictionary<string, UserDto> _users = new Dictionary<string, UserDto>();

        private readonly Dictionary<string, string> _passwords = new Dictionary<string, string>();

        public static LoginProviderBuilder CreateBuilder() => new LoginProviderBuilder();

        private LoginProviderBuilder()
        {

        }

        public LoginProviderBuilder WithUser(UserDto user, string password)
        {
            return WithUserImpl(user, password);
        }

        public LoginProviderBuilder WithUser(string username, string password)
        {
            var user = new UserDto
            {
                Username = username,
                Fullname = username
            };
            return WithUserImpl(user, password);
        }

        private LoginProviderBuilder WithUserImpl(UserDto user, string password)
        {
            _users.Add(user.Username, user);
            _passwords.Add(user.Username, password);
            return this;
        }

        protected override IServiceCall<ILoginProvider> CreateServiceCall(
            IHaveNoMethods<ILoginProvider> serviceCallTemplate) => serviceCallTemplate
            .AddMethodCallWithResult<string, string, UserDto>(
                t => t.GetUser(It.IsAny<string>(), It.IsAny<string>()),
                (r, n, p) => r.Complete(GetUser));

        private UserDto GetUser(string username, string password)
        {
            if (_passwords.TryGetValue(username, out var p))
            {
                if (p != password)
                {
                    throw new AuthenticationException("Wrong password");
                }

                return _users[username];
            }

            throw new AuthenticationException("Username not found");
        }
    }
}