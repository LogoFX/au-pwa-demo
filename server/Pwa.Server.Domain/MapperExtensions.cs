using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Domain.Entities;
using Pwa.Server.Domain.Entities.Contracts;

namespace Pwa.Server.Domain
{
    internal static class MapperExtensions
    {
        public static IUser ToEntity(this UserDto userDto)
        {
            return new User(userDto.Id, userDto.Username, userDto.Fullname);
        }
    }
}