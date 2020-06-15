using System.IO;

namespace Pwa.Server.Infra
{
    public interface IFileSystemHelper
    {
        void Copy(string sourceFileName, string destFileName);
    }

    public sealed class FileSystemHelper : IFileSystemHelper
    {
        public void Copy(string sourceFileName, string destFileName)
        {
            destFileName = destFileName.Replace('\\', Path.DirectorySeparatorChar);
            destFileName = destFileName.Replace('/', Path.DirectorySeparatorChar);
            var folder = Path.GetDirectoryName(destFileName);
            if (null != folder && Directory.Exists(folder) == false)
            {
                Directory.CreateDirectory(folder);
            }
            File.Copy(sourceFileName, destFileName, true);
        }
    }
}