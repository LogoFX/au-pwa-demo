using System.Security.Authentication;
using RestSharp;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Infra;
using Pwa.Server.Services.Sdk.Models;

namespace Pwa.Server.Services.Sdk
{
    internal sealed class LoginProxy : ILoginProvider
    {
        private readonly IRequestFactory _requestFactory;
        private readonly IRestClientData _restClientData;

        public LoginProxy(
            IRequestFactory requestFactory,
            IRestClientData restClientData)
        {
            _requestFactory = requestFactory;
            _restClientData = restClientData;
        }

        public UserDto GetUser(string username, string password)
        {
            var request =
                _requestFactory.GetRequest($"api/data/login/{username}/{password}", Method.GET);
            var response = _restClientData.Execute<GetUserResponse>(request);
            if (response.ErrorException != null)
            {
                throw response.ErrorException;
            }

            if (string.IsNullOrEmpty(response.Data.error) == false)
            {
                throw new AuthenticationException(response.Data.error);
            }
            return response.Data.user;
        }
    }
}