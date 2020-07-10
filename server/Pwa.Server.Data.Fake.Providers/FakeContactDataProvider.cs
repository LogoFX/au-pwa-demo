using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Attest.Fake.Builders;
using JetBrains.Annotations;
using Pwa.Server.Data.Contracts.Dto;
using Pwa.Server.Data.Contracts.Providers;
using Pwa.Server.Data.Fake.Containers;
using Pwa.Server.Data.Fake.ProviderBuilders;

namespace Pwa.Server.Data.Fake.Providers
{
    [UsedImplicitly]
    internal sealed class FakeContactDataProvider : FakeProviderBase<ContactProviderBuilder, IContactDataProvider>, IContactDataProvider
    {
        private readonly Random _random = new Random();

        public FakeContactDataProvider(
            ContactProviderBuilder sampleProviderBuilder,
            IContactDataContainer sampleContainer)
            : base(sampleProviderBuilder)
        {
            sampleProviderBuilder.WithItems(sampleContainer.Items);
        }

        IEnumerable<ContactDto> IContactDataProvider.GetItems() => GetService(r =>
        {
            Task.Delay(_random.Next(2000)).Wait();
            return r;
        }).GetItems();

        public ContactDto GetItem(Guid id) => GetService(r =>
        {
            Task.Delay(_random.Next(2000)).Wait();
            return r;
        }).GetItem(id);

        bool IContactDataProvider.DeleteItem(Guid id) => GetService(r =>
        {
            Task.Delay(_random.Next(2000)).Wait();
            return r;
        }).DeleteItem(id);

        bool IContactDataProvider.UpdateItem(ContactDto dto) => GetService(r =>
        {
            Task.Delay(_random.Next(2000)).Wait();
            return r;
        }).UpdateItem(dto);

        void IContactDataProvider.CreateItem(ContactDto dto) => GetService(r =>
        {
            Task.Delay(_random.Next(2000)).Wait();
            return r;
        }).CreateItem(dto);
    }
}