﻿using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using JetBrains.Annotations;
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

        /// <summary>
        /// Gets all contacts.
        /// </summary>
        /// <returns>The list of contacts.</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _contactsService.GetItems());
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to retrieve contacts: {ex.Message}");
            }
        }

        /// <summary>
        /// Deletes contact.
        /// </summary>
        /// <param name="id">Contact's id.</param>
        /// <returns></returns>
        [HttpDelete]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var contact = await _contactsService.GetItem(id);
                if (contact == null)
                {
                    return NotFound($"Contact with ID={id} not found.");
                }

                await _contactsService.DeleteItem(contact);

                return Ok();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to delete the contact: {ex.Message}");
            }
        }

        /// <summary>
        /// Updates contact's data'.
        /// </summary>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ContactObject contactObject)
        {
            try
            {
                var contact = await _contactsService.GetItem(contactObject.id);
                if (contact == null)
                {
                    return NotFound($"Contact with ID={contactObject.id} not found.");
                }

                contact.FirstName = contactObject.firstName;
                contact.LastName = contactObject.lastName;
                contact.EMail = contactObject.email;
                await _contactsService.SaveItem(contact);

                return Ok();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to update the contact: {ex.Message}");
            }
        }

        /// <summary>
        /// Adds new contact.
        /// </summary>
        /// <returns>The list of users.</returns>
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] ContactObject contactObject)
        {
            try
            {
                var contact = await _contactsService.NewItem(contactObject.id);
                contact.FirstName = contactObject.firstName;
                contact.LastName = contactObject.lastName;
                contact.EMail = contactObject.email;
                await _contactsService.SaveItem(contact);

                return Ok();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"Unable to add the contact: {ex.Message}");
            }
        }

        /// <summary>
        /// Object to client-server interchange
        /// </summary>
        [SuppressMessage("ReSharper", "InconsistentNaming")]
        public sealed class ContactObject
        {
            /// <summary>
            /// The contact's ID
            /// </summary>
            public Guid id { get; [UsedImplicitly] set; }
            
            /// <summary>
            /// Contact's first name
            /// </summary>
            public string firstName { get; [UsedImplicitly] set; }
            
            /// <summary>
            /// Contact's last name
            /// </summary>
            public string lastName { get; [UsedImplicitly] set; }
            
            /// <summary>
            /// Contact's e-mail
            /// </summary>
            public string email { get; [UsedImplicitly] set; }
        }
    }
}