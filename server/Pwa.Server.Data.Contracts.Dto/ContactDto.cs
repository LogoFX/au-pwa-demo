using System;

namespace Pwa.Server.Data.Contracts.Dto
{
    public class ContactDto
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string EMail { get; set; }
    }
}