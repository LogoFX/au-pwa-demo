using System;
using System.Collections.Generic;
using System.Linq;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;

namespace Pwa.Server.Data.Fake.Providers
{
    internal sealed class FakeUsersProvider : IUsersProvider
    {
        private readonly List<UserDto> _users = new List<UserDto>();

        public FakeUsersProvider()
        {
            _users.AddRange(new[]
            {
                CreateUser("User1", "User One"),
                CreateUser("User2", "User Two"),
                CreateUser("User3", "User Three")
            });
        }

        private UserDto CreateUser(string username, string fullname)
        {
            return new UserDto {Id = Guid.NewGuid(), Username = username, Fullname = fullname};
        }

        private UserDto GetUserByNameInternal(string username)
        {
            return _users.FirstOrDefault(x => string.Compare(x.Username, username, StringComparison.OrdinalIgnoreCase) == 0);
        }

        private UserDto GetUserByIdInternal(Guid id)
        {
            return _users.FirstOrDefault(x => x.Id == id);
        }

        UserDto[] IUsersProvider.GetUsers()
        {
            return _users.ToArray();
        }

        UserDto IUsersProvider.GetUserByName(string username)
        {
            return GetUserByNameInternal(username);
        }

        UserDto IUsersProvider.GetUserById(Guid id)
        {
            return GetUserByIdInternal(id);
        }

        UserDto IUsersProvider.AddUser(string username, string fullname)
        {
            if (GetUserByNameInternal(username) != null)
            {
                throw new ApplicationException($"User '{username}' already added.");
            }

            var userDto = CreateUser(username, fullname);
            _users.Add(userDto);

            return userDto;
        }

        bool IUsersProvider.RemoveUser(Guid id)
        {
            var user = GetUserByIdInternal(id);
            return _users.Remove(user);
        }

        UserDto IUsersProvider.UpdateUser(Guid id, string username, string fullname)
        {
            var user = GetUserByIdInternal(id);
            user.Username = username;
            user.Fullname = fullname;

            return user;
        }
    }
}