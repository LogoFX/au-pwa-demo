using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Domain.Entities.Contracts;

namespace Pwa.Server.Domain.Services
{
    public interface IUsersService
    {
        Task<IEnumerable<IUser>> GetUsersAsync();

        Task<IUser> GetUserByNameAsync(string username);

        Task<IUser> AddUserAsync(string username, string fullname);

        Task<bool> RemoveUserAsync(IUser user);

        Task<IUser> UpdateUserAsync(IUser user, string username, string fullname);
    }

    [UsedImplicitly]
    public class UsersService : IUsersService
    {
        private readonly IUsersProvider _usersProvider;

        public UsersService(IUsersProvider usersProvider)
        {
            _usersProvider = usersProvider;
        }

        Task<IEnumerable<IUser>> IUsersService.GetUsersAsync()
        {
            return Task.Run(() => _usersProvider.GetUsers().Select(x => x.ToEntity()));
        }

        Task<IUser> IUsersService.GetUserByNameAsync(string username)
        {
            return Task.Run(() => _usersProvider.GetUserByName(username).ToEntity());
        }

        Task<IUser> IUsersService.AddUserAsync(string username, string fullname)
        {
            return Task.Run(() => _usersProvider.AddUser(username, fullname).ToEntity());
        }

        Task<bool> IUsersService.RemoveUserAsync(IUser user)
        {
            return Task.Run(() => _usersProvider.RemoveUser(user.Id));
        }

        Task<IUser> IUsersService.UpdateUserAsync(IUser user, string username, string fullname)
        {
            return Task.Run(() => _usersProvider.UpdateUser(user.Id, username, fullname).ToEntity());
        }
    }
}