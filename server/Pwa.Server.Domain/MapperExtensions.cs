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

        public static IContact ToEntity(this ContactDto contactDto)
        {
            return new Contact(contactDto.Id, contactDto.FirstName, contactDto.LastName, contactDto.EMail);
        }

        public static ContactDto ToDto(this IContact contact)
        {
            return new ContactDto
            {
                Id = contact.Id,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                EMail = contact.EMail
            };
        }
    }
}