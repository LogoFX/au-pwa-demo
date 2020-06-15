using AutoMapper;
using JetBrains.Annotations;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Model.Contracts;

namespace Pwa.Server.Model.Mappers
{
    [UsedImplicitly]
    internal sealed class ContactMapper
    {
        private readonly IMapper _mapper;

        public ContactMapper(IMapper mapper) => _mapper = mapper;

        public IContact MapToContact(ContactDto dto) =>
            _mapper.Map<IContact>(dto);

        public ContactDto MapFromContact(IContact model) =>
            _mapper.Map<ContactDto>(model);
    }
}