using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Pwa.Server.Domain.Services;

namespace Pwa.Server.Api.Controllers
{
    /// <summary>
    /// Users controller.
    /// </summary>
    [Route("[controller]")]
    public class UsersController : Controller
    {
        private readonly IUsersService _usersService;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:Pwa.Server.Api.Controllers.UsersController"/> class.
        /// </summary>
        /// <param name="usersService">Users service.</param>
        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        /// <summary>
        /// Gets all users.
        /// </summary>
        /// <returns>The list of users.</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _usersService.GetUsersAsync());
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to retrieve users: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets user by name.
        /// </summary>
        /// <returns>The user.</returns>
        [HttpGet("{username}")]
        public async Task<IActionResult> GetByName(string username)
        {
            try
            {
                return Ok(await _usersService.GetUserByNameAsync(username));
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to retrieve users: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes user by user name.
        /// </summary>
        /// <param name="username">User's name.</param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> Delete(string username)
        {
            try
            {
                var user = await _usersService.GetUserByNameAsync(username);
                if (user == null)
                {
                    return NotFound($"User '{username}' not found.");
                }

                await _usersService.RemoveUserAsync(user);

                return Ok();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to delete the user: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates user's data'.
        /// </summary>
        /// <param name="username">User's name.</param>
        /// <param name="fullname">New user's full name.'</param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> Update(string username, string fullname)
        {
            try
            {
                var user = await _usersService.GetUserByNameAsync(username);
                if (user == null)
                {
                    return NotFound($"User '{username}' not found.");
                }

                await _usersService.UpdateUserAsync(user, username, fullname);

                return Ok();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to update the user: {ex.Message}");
            }
        }

        /// <summary>
        /// Adds new user'.
        /// </summary>
        /// <param name="username">User's name.</param>
        /// <param name="fullname">User's full name.'</param>
        /// <returns>The list of users.</returns>
        [HttpPost]
        public async Task<IActionResult> Add(string username, string fullname)
        {
            try
            {
                await _usersService.AddUserAsync(username, fullname);
                return Ok();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to add a user: {ex.Message}");
            }
        }
    }
}