using JetBrains.Annotations;
using Microsoft.Extensions.DependencyInjection;
using Solid.Practices.Modularity;

namespace Pwa.Server.Facade
{
    [UsedImplicitly]
    internal sealed class Module : ICompositionModule<IServiceCollection>
    {
        public void RegisterModule(IServiceCollection dependencyRegistrator)
        {
            dependencyRegistrator
                .AddCors(options => options.AddPolicy("AllowAny",
                    builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()))
                .AddAuthentication()
                .AddOpenIdConnectServer(options =>
                {
                    options.ProviderType = typeof(AuthorizationProvider);

                    // Enable the authorization, logout, token and userinfo endpoints.
                    options.AuthorizationEndpointPath = "/connect/authorize";
                    options.LogoutEndpointPath = "/connect/logout";
                    options.TokenEndpointPath = "/connect/token";
                    options.UserinfoEndpointPath = "/connect/userinfo";

                    // Note: see AuthorizationController.cs for more
                    // information concerning ApplicationCanDisplayErrors.
                    options.ApplicationCanDisplayErrors = true;
                    options.AllowInsecureHttp = true;

                    // Note: to override the default access token format and use JWT, assign AccessTokenHandler:
                    //
                    // options.AccessTokenHandler = new JwtSecurityTokenHandler
                    // {
                    //     InboundClaimTypeMap = new Dictionary<string, string>(),
                    //     OutboundClaimTypeMap = new Dictionary<string, string>()
                    // };
                    //
                    // Note: when using JWT as the access token format, you have to register a signing key.
                    //
                    // You can register a new ephemeral key, that is discarded when the application shuts down.
                    // Tokens signed using this key are automatically invalidated and thus this method
                    // should only be used during development:
                    //
                    // options.SigningCredentials.AddEphemeralKey();
                    //
                    // On production, using a X.509 certificate stored in the machine store is recommended.
                    // You can generate a self-signed certificate using Pluralsight's self-cert utility:
                    // https://s3.amazonaws.com/pluralsight-free/keith-brown/samples/SelfCert.zip
                    //
                    // options.SigningCredentials.AddCertificate("7D2A741FE34CC2C7369237A5F2078988E17A6A75");
                    //
                    // Alternatively, you can also store the certificate as an embedded .pfx resource
                    // directly in this assembly or in a file published alongside this project:
                    //
                    // options.SigningCredentials.AddCertificate(
                    //     assembly: typeof(Startup).GetTypeInfo().Assembly,
                    //     resource: "Mvc.Server.Certificate.pfx",
                    //     password: "Owin.Security.OpenIdConnect.Server");
                });

            dependencyRegistrator.AddScoped<AuthorizationProvider>();
        }
    }
}