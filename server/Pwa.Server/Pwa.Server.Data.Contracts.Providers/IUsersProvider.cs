using System;
using Pwa.Server.Data.Contracts.Dto;

namespace Pwa.Server.Data.Contracts.Providers
{
    public interface IUsersProvider
    {
        UserDto[] GetUsers();

        UserDto GetUserByName(string username);

        UserDto GetUserById(Guid id);

        UserDto AddUser(string username, string fullname);

        bool RemoveUser(Guid id);

        UserDto UpdateUser(Guid id, string username, string fullname);
    }
}