using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Pwa.Server.Domain.Services;

namespace Pwa.Server.Api.Controllers
{
    /// <summary>
    /// Contacts controller.
    /// </summary>
    [Route("[controller]")]
    public class ContactsController : Controller
    {
        private readonly IContactService _contactsService;
        private readonly IUsersService _usersService;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:Pwa.Server.Api.Controllers.ContactsController"/> class.
        /// </summary>
        /// <param name="contactsService">Contacts service.</param>
        /// <param name="usersService">Users service.</param>
        public ContactsController(IContactService contactsService, IUsersService usersService)
        {
            _contactsService = contactsService;
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
    }
}