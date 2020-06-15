using System;
using AutoMapper;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Model.Contracts;

namespace Pwa.Server.Model.Mappers
{
    internal sealed class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateSampleItemMaps();
            CreateContactMaps();
        }

        private void CreateContactMaps()
        {
            CreateDomainObjectMap<ContactDto, IContact, Contact>();
        }

        private void CreateSampleItemMaps()
        {
            CreateDomainObjectMap<SampleItemDto, ISampleItem, SampleItem>();
        }

        private void CreateDomainObjectMap<TDto, TContract, TModel>()
            where TModel : TContract where TContract : class => CreateDomainObjectMap(typeof(TDto), typeof(TContract), typeof(TModel));
        private void CreateDomainObjectMap(Type dtoType, Type contractType, Type modelType)
        {
            CreateMap(dtoType, contractType).As(modelType);
            CreateMap(dtoType, modelType);
            CreateMap(contractType, dtoType);
            CreateMap(modelType, dtoType);
        }
    }
}