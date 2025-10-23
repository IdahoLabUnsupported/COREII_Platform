// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using CoreII.Business.ResourceLibrary;
//using CoreII.Api.Data;
using CoreII.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreIIApi.Controllers
{
    [Route("api/resourceLibrary")]
    [ApiController]
    public class ResourceLibraryController : Controller
    {
        private PortalContext _context;
        public ResourceLibraryController(PortalContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> Upload(List<IFormFile> files, int? categoryId)
        {
            int defaultCategoryId = categoryId ?? 1;
            long size = files.Sum(f => f.Length);

            var filePaths = new List<string>();
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "Documents");

            // Ensure the directory exists
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {

                    var fileName = Path.GetFileName(formFile.FileName);
                    var filePath = Path.Combine(uploadsFolderPath, fileName);
                    // Ensure the file name is unique to prevent overwriting existing files
                    filePath = EnsureUniqueFilePath(filePath);

                    filePaths.Add(filePath);

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                    categoryId = 1;
                    // Save file info to database
                    var resource = new ResourceLibrary
                    {

                        Category_Id = defaultCategoryId,
                        File_Name = formFile.FileName,
                        FilePath = filePath,
                        Title = formFile.FileName,
                        Comments = "Your comment here",
                    };

                    _context.ResourceLibraries.Add(resource);
                    await _context.SaveChangesAsync();
                    var searchService = new ResourceLibrarySearch();
                    searchService.AddToLuceneIndex(resource);
                }
            }

          
         
            return Ok(new { count = files.Count, size, filePaths });
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetResources()
        {
            try
            {
                var resourcesWithCategories = _context.ResourceLibraries
           .Include(r => r.ResourceLibraryCategory)
           .Select(r => new
           {
               FileId = r.File_Id,
               FileName = r.File_Name,
               Title = r.Title,
               Name = r.Name,
               Comments = r.Comments,
               Description = r.Description,
               ShortName = r.Short_Name,
               PublishDate = r.Publish_Date,
               DocVersion = r.Doc_Version,
               Summary = r.Summary,
               SourceType = r.Source_Type,
               FilePath = r.FilePath,
               CategoryName = r.ResourceLibraryCategory.Category_Name,
               CategoryId = r.Category_Id
           }).ToList();

                //return Ok(resourcesWithCategories);
                var categories = _context.ResourceLibraryCategories
            .Select(c => new { c.Category_Id, c.Category_Name })
            .ToList();

                return Ok(new { Resources = resourcesWithCategories, Categories = categories });
            }
            catch (Exception ex)
            {
                // Log the exception and return an Internal Server Error
                Console.WriteLine(ex);
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }

        private string EnsureUniqueFilePath(string filePath)
        {
            var count = 1;
            var fileName = Path.GetFileNameWithoutExtension(filePath);
            var extension = Path.GetExtension(filePath);
            var directory = Path.GetDirectoryName(filePath);
            var newFilePath = filePath;

            while (System.IO.File.Exists(newFilePath))
            {
                newFilePath = Path.Combine(directory, $"{fileName}({count++}){extension}");
            }

            return newFilePath;
        }
        [HttpPost("update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateResourceViaPost(int id, [FromBody] ResourceLibraryDto resourceUpdate)
        {
            var resource = await _context.ResourceLibraries.FindAsync(id);
            if (resource == null)
            {
                return NotFound($"Resource with ID {id} not found.");
            }

            // Assigning the updated values from the resourceUpdate object
            resource.File_Name = resourceUpdate.FileName;
            resource.Title = resourceUpdate.Title;
            // resource.Name = resourceUpdate.Name;
            resource.Comments = resourceUpdate.Comments;
            // resource.Description = resourceUpdate.Description;
            // resource.Short_Name = resourceUpdate.ShortName;
            resource.Publish_Date = resourceUpdate.PublishDate;
            // resource.Doc_Version = resourceUpdate.DocVersion;
            resource.Summary = resourceUpdate.Summary;
            // resource.Source_Type = resourceUpdate.SourceType;
            resource.Category_Id = resourceUpdate.CategoryId; // Ensure this is properly assigned

            _context.ResourceLibraries.Update(resource);
            var searchService = new ResourceLibrarySearch();
            searchService.UpdateDocumentInIndex(resource);
            await _context.SaveChangesAsync();

            return Ok(resource); 
        }
 
        [HttpGet("search")]
        [Authorize]
        public IActionResult SearchResources(string term)
        {
            try
            {
                var searchService = new ResourceLibrarySearch();
                var searchResults = searchService.SearchResources(term);

                // Map Lucene documents to your desired return format
                var resourcesWithCategories = searchResults.Select(doc => new
                {
                    FileId = doc.Get("File_Id"),
                    FileName = doc.Get("File_Name"),
                    Description = doc.Get("Description"),
                    Name=doc.Get("Name")
                    // Add other fields as needed
                }).ToList();

                return Ok(resourcesWithCategories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error: Could not complete the search." + ex.Message);
            }
        }
       
        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteResource(int id)
        {
            var resource = await _context.ResourceLibraries.FindAsync(id);
            if (resource == null)
            {
                return NotFound($"Resource with ID {id} not found.");
            }

            // Delete the file from the filesystem
            if (!string.IsNullOrEmpty(resource.FilePath) && System.IO.File.Exists(resource.FilePath))
            {
                try
                {
                    System.IO.File.Delete(resource.FilePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Failed to delete file: " + ex.Message);
                    return StatusCode(500, "Internal Server Error: Could not delete the file.");
                }
            }

            _context.ResourceLibraries.Remove(resource);
            await _context.SaveChangesAsync();

            // Update Lucene index by deleting the document
            var searchService = new ResourceLibrarySearch();
            searchService.DeleteDocumentFromIndex(id);

            return Ok("Resource and associated file deleted successfully.");
        }
        [HttpDelete("deleteList")]
        [Authorize]
        public async Task<IActionResult> DeleteResources([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No resource IDs provided.");
            }

            var failedDeletions = new List<int>();
            var searchService = new ResourceLibrarySearch();

            foreach (var id in ids)
            {
                var resource = await _context.ResourceLibraries.FindAsync(id);
                if (resource == null)
                {
                    failedDeletions.Add(id);
                    continue;
                }

                // Delete the file from the filesystem
                if (!string.IsNullOrEmpty(resource.FilePath) && System.IO.File.Exists(resource.FilePath))
                {
                    try
                    {
                        System.IO.File.Delete(resource.FilePath);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to delete file for resource ID {id}: " + ex.Message);
                        failedDeletions.Add(id);
                        continue;
                    }
                }

                _context.ResourceLibraries.Remove(resource);
                await _context.SaveChangesAsync();

                // Update Lucene index by deleting the document
                searchService.DeleteDocumentFromIndex(id);
            }

            if (failedDeletions.Any())
            {
                return StatusCode(500, $"Failed to delete resources with IDs: {string.Join(", ", failedDeletions)}");
            }

            return Ok("Resources and associated files deleted successfully.");
        }

    }
}

