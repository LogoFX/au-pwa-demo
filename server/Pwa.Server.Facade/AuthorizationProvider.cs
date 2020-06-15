using System.Net;
using System.Security.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using Microsoft.AspNetCore.Authentication;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;

namespace Pwa.Server.Facade
{
    /// <inheritdoc />
    public sealed class AuthorizationProvider : OpenIdConnectServerProvider
    {
        private readonly ILoginProvider _loginProvider;

        /// <inheritdoc />
        public AuthorizationProvider(ILoginProvider loginProvider)
        {
            _loginProvider = loginProvider;
        }

        /// <inheritdoc />
        public override Task ValidateTokenRequest(ValidateTokenRequestContext context)
        {
            // Reject the token requests that don't use
            // grant_type=password or grant_type=refresh_token.
            if (!context.Request.IsPasswordGrantType() &&
                !context.Request.IsRefreshTokenGrantType())
            {
                context.Reject(
                    error: OpenIdConnectConstants.Errors.UnsupportedGrantType,
                    description: "Only grant_type=password and refresh_token " +
                                 "requests are accepted by this server.");

                return Task.CompletedTask;
            }

            // Since there's only one application and since it's a public client
            // (i.e a client that cannot keep its credentials private), call Skip()
            // to inform the server that the request should be accepted without 
            // enforcing client authentication.
            context.Skip();
            return Task.CompletedTask;
        }

        /// <inheritdoc />
        public override Task HandleTokenRequest(HandleTokenRequestContext context)
        {
            // Only handle grant_type=password token requests and let the
            // OpenID Connect server middleware handle the other grant types.
            if (context.Request.IsPasswordGrantType())
            {
                // Validate the credentials here (e.g using ASP.NET Core Identity).
                // You can call Reject() with an error code/description to reject
                // the request and return a message to the caller.

                // ReSharper disable once NotAccessedVariable
                UserDto user;

                var credential = new NetworkCredential(context.Request.Username, context.Request.Password);
                try
                {
                    // ReSharper disable once RedundantAssignment
                    user = _loginProvider.GetUser(credential.UserName, credential.Password);
                }
                catch (AuthenticationException err)
                {
                    context.Reject(
                        error: OpenIdConnectConstants.Errors.InvalidClient,
                        description: err.Message);

                    return Task.CompletedTask;
                }

                var identity = new ClaimsIdentity();
                identity.AddClaim(OpenIdConnectConstants.Claims.Subject, "[unique identifier]");

                // By default, claims are not serialized in the access and identity tokens.
                // Use the overload taking a "destinations" parameter to make sure 
                // your claims are correctly serialized in the appropriate tokens.
                identity.AddClaim("urn:customclaim", "value",
                    OpenIdConnectConstants.Destinations.AccessToken,
                    OpenIdConnectConstants.Destinations.IdentityToken);

                var ticket = new AuthenticationTicket(
                    new ClaimsPrincipal(identity),
                    new AuthenticationProperties(),
                    "Role");

                // Call SetResources with the list of resource servers
                // the access token should be issued for.
                ticket.SetResources("resource_server_1");

                // Call SetScopes with the list of scopes you want to grant
                // (specify offline_access to issue a refresh token).
                ticket.SetScopes("profile", "offline_access");

                context.Validate(ticket);
            }

            return Task.CompletedTask;
        }
    }
}