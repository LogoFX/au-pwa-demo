using RestSharp;

namespace Pwa.Server.Infra
{
    public interface IRestClient
    {
        IRestResponse Execute(IRestRequest request);
        IRestResponse<T> Execute<T>(IRestRequest request) where T : new();
    }    

    public abstract class RestClientBase : IRestClient
    {
        private readonly RestClient _restClient;

        protected RestClientBase(string url)
        {
            _restClient = new RestClient(url) {Timeout = 3000};
        }

        public IRestResponse Execute(IRestRequest request)
        {
            return _restClient.Execute(request);
        }

        public IRestResponse<T> Execute<T>(IRestRequest request) where T : new()
        {
            return _restClient.Execute<T>(request);
        }
    }

    public interface IRestClientServer : IRestClient
    {

    }

    public interface IRestClientInternal : IRestClient
    {

    }

    public interface IRestClientConfig : IRestClient
    {

    }

    public interface IRestClientData : IRestClient
    {

    }

    public class RestClientServer : RestClientBase, IRestClientServer
    {
        public RestClientServer() : base("http://localhost:54336")
        {

        }
    }

    public class RestClientInternal : RestClientBase, IRestClientInternal
    {
        public RestClientInternal() : base("http://localhost:54346")
        {

        }
    }

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