using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Pwa.Server.Infra
{
    public interface IFileStreamHelper
    {
        IActionResult GetStream(string url);
        Task<string> SaveFile(IFormFile formFile);
        Task<string> SaveFile(string sourceFileName);
    }

    public sealed class FileStreamHelper : Controller, IFileStreamHelper
    {
        public IActionResult GetStream(string url)
        {
            var stream = System.IO.File.OpenRead(url);
            var fileStreamResult = File(stream, "application/octet-stream");
            return fileStreamResult;
        }

        private string GenerateUniqueFileName(string name)
        {
            string filePath = Path.GetTempPath();
            filePath = Path.Combine(filePath, "NovaAlgoLab");
            while (true)
            {
                var tmpDirName = Path.GetRandomFileName();
                var newTempPath = Path.Combine(filePath, tmpDirName);

                if (Directory.Exists(newTempPath) || System.IO.File.Exists(newTempPath))
                {
                    continue;
                }

                try
                {
                    Directory.CreateDirectory(newTempPath);
                }

                catch (Exception err)
                {
                    Console.WriteLine(err.Message);
                    throw;
                }

                filePath = newTempPath;
                break;
            }
            return Path.Combine(filePath, name);
        }


        public async Task<string> SaveFile(IFormFile formFile)
        {
            var filePath = GenerateUniqueFileName(formFile.FileName);

            if (formFile.Length > 0)
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await formFile.CopyToAsync(stream);
                }
            }

            return filePath;
        }

        public Task<string> SaveFile(string sourceFileName)
        {
            var fileName = Path.GetFileName(sourceFileName);
            var filePath = GenerateUniqueFileName(fileName);

            System.IO.File.Copy(sourceFileName, filePath, true);
            return Task.FromResult(filePath);
        }
    }
}