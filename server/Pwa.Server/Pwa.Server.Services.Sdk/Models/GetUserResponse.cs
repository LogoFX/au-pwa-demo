using System.Diagnostics.CodeAnalysis;
using Pwa.Server.Data.Contracts.Dto;

namespace Pwa.Server.Services.Sdk.Models
{
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    internal class GetUserResponse
    {
        public string error { get; set; }
        public UserDto user { get; set; }
    }
}