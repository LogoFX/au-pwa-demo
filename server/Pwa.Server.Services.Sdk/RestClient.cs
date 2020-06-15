using Pwa.Server.Infra;

namespace Pwa.Server.Services.Sdk
{
    public class RestClientConfig : RestClientBase, IRestClientConfig
    {
        public RestClientConfig() : base("http://localhost:54356")
        {

        }
    }

    public class RestClientData : RestClientBase, IRestClientData
    {
        public RestClientData() : base("http://localhost:54366")
        {

        }
    }
}