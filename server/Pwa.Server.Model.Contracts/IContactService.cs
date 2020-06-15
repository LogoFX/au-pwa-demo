using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pwa.Server.Model.Contracts
{
    public interface IContactService
    {
        IEnumerable<IContact> Items { get; }

        Task GetItems();

        Task<IContact> NewItem();

        Task SaveItem(IContact item);

        Task DeleteItem(IContact item);
    }
}