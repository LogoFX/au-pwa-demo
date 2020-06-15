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

        /// <summary>
        /// Initializes a new instance of the <see cref="T:Pwa.Server.Api.Controllers.ContactsController"/> class.
        /// </summary>
        /// <param name="contactsService">Contacts service.</param>
        public ContactsController(IContactService contactsService)
        {
            _contactsService = contactsService;
        }
    }
}