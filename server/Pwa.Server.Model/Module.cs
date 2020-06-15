using System.Reflection;
using AutoMapper;
using JetBrains.Annotations;
using Pwa.Server.Model.Contracts;
using Pwa.Server.Model.Mappers;
using Solid.Practices.IoC;
using Solid.Practices.Modularity;

namespace Pwa.Server.Model
{
    [UsedImplicitly]
    internal sealed class Module : ICompositionModule<IDependencyRegistrator>
    {
        public void RegisterModule(IDependencyRegistrator dependencyRegistrator)
        {
            dependencyRegistrator
                .RegisterAutomagically(
                    Assembly.LoadFrom(AssemblyInfo.AssemblyName),
                    Assembly.GetExecutingAssembly());

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfile());
            });
            var mapper = config.CreateMapper();
            dependencyRegistrator
                .AddInstance(mapper)
                .AddSingleton<SampleMapper>()
                .AddSingleton<ContactMapper>();
        }
    }
}
