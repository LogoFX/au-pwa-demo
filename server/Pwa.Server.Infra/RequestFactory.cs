using System;
using Microsoft.AspNetCore.Http;
using RestSharp;

namespace Pwa.Server.Infra
{
    public interface IRequestFactory
    {
        IRestRequest GetRequest(string route, Method method, object body = null, bool skipContentProcessing = false);

        IRestRequest GetXFormRequest(string route, Method method, object body = null, bool skipContentProcessing = false);

        IRestRequest GetMultipartFormRequest(string route, Method method, IFormCollection body);
    }

    public sealed class RestRequestFactory : IRequestFactory
    {
        private IRestRequest CreateRequest(string route, Method method, bool skipContentProcessing = false)
        {
            var restRequest = new RestRequest(route, method)
            {
                RequestFormat = skipContentProcessing ? DataFormat.Xml : DataFormat.Json,
                Timeout = (int)TimeSpan.FromSeconds(30).TotalMilliseconds
            };

            return restRequest;
        }

        private IRestRequest CreateRequest(string route, Method method, string contentType, object body, bool skipContentProcessing)
        {
            var restRequest = CreateRequest(route, method, skipContentProcessing);
            restRequest.AddHeader("Accept", "application/json");
            restRequest.AddHeader("Content-Type", contentType);

            if (method == Method.PUT || method == Method.POST)
            {
                if (skipContentProcessing)
                {
                    restRequest.AddParameter("text/xml", body, ParameterType.RequestBody);
                }
                else
                {
                    restRequest.AddBody(body);
                }
            }

            return restRequest;
        }

        public IRestRequest GetRequest(string route, Method method, object body = null, bool skipContentProcessing = false)
        {
            return CreateRequest(route, method, "application/json", body, skipContentProcessing);
        }

        public IRestRequest GetXFormRequest(string route, Method method, object body = null, bool skipContentProcessing = false)
        {
            return CreateRequest(route, method, "application/x-www-form-urlencoded", body, skipContentProcessing);
        }

        public IRestRequest GetMultipartFormRequest(string route, Method method, IFormCollection body)
        {
            var restRequest = CreateRequest(route, method);

            foreach (var entry in body)
            {
                restRequest.AddParameter(entry.Key, entry.Value);
            }

            if (body.Files != null)
            {
                foreach (var file in body.Files)
                {
                    restRequest.AddFile(
                        file.Name,
                        s => { file.CopyTo(s); },
                        file.FileName,
                        file.Length,
                        file.ContentType);
                }
            }

            return restRequest;
        }
    }
}