using System;

namespace Pwa.Server.Data.Contracts.Dto
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string Username { get; set; }

        public string Fullname { get; set; }
    }
}