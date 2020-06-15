using Pwa.Server.Model.Contracts;

namespace Pwa.Server.Model
{
    internal class Contact : AppModel, IContact
    {
        private string _displayName;

        public string DisplayName
        {
            get => _displayName;
            set => SetProperty(ref _displayName, value);
        }

        private int _value;

        public int Value
        {
            get => _value;
            set => SetProperty(ref _value, value);
        }
    }
}