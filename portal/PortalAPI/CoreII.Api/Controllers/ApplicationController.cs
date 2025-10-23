// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using CoreII.Data;
using CoreII.Interfaces.Application;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace CoreIIApi.Controllers;

[Route("api/application")]
[ApiController]
public class ApplicationController : Controller
{
    private readonly IApplicationBusiness _app;

    public ApplicationController(IApplicationBusiness app)
    {
        _app = app;
    }

    [HttpGet]
    [Authorize]
    [Route("getapp/{appName}")]
    public IActionResult GetApplication(string appName)
    {
        var application = _app.GetApplication(appName.ToUpper());
        var applicationImages = _app.GetApplicationImages(appName);
        return Ok(new App
        {
            Application = application,
            ApplicationImages = applicationImages
        });
    }

    [HttpGet]
    [Authorize]
    [Route("getapps")]
    public IActionResult GetApplications()
    {
        var applications = _app.GetApplications();
        return Ok(applications);
    }
    [HttpPost]
    [Authorize]
    [Route("editapp")]
    public async Task<IActionResult> EditApplication([FromBody] Application updatedApplication)
    {
        if (updatedApplication == null)
        {
            return BadRequest("No application data provided for update.");
        }
        var result = await _app.EditApplication(updatedApplication);
        if (result)
        {
            return Ok("Application updated successfully.");
        }
        else
        {
            return NotFound($"Application with ID {updatedApplication.ApplicationId} not found.");
        }
    }
    [HttpDelete]
    [Authorize]
    [Route("deleteapp/{id}")]
    public async Task<IActionResult> DeleteApplication(int id)
    {
        var result = await _app.DeleteApplication(id);
        if (result)
        {
            return Ok("Application deleted successfully."); ;
        }
        else
        {
            return BadRequest(result);
        }
    }
    [HttpPost]
    [Authorize]
    [Route("addapp")]
public async Task<ActionResult> AddApplication([FromForm] ApplicationDto newApplication)
{
    if (newApplication == null)
    {
        return BadRequest("No application data provided for update.");
    }

    var application = new Application
    {
        ApplicationName = string.IsNullOrEmpty(newApplication.ApplicationName) ? string.Empty : newApplication.ApplicationName,
        TextWorks = string.IsNullOrEmpty(newApplication.TextWorks) ? string.Empty : newApplication.TextWorks,
        TextData = string.IsNullOrEmpty(newApplication.TextData) ? string.Empty : newApplication.TextData,
        TextHelps = string.IsNullOrEmpty(newApplication.TextHelps) ? string.Empty : newApplication.TextHelps,
        TextSummary = string.IsNullOrEmpty(newApplication.TextSummary) ? string.Empty : newApplication.TextSummary,
        Tlr = newApplication.Tlr,
        ApplicationUrl = string.IsNullOrEmpty(newApplication.ApplicationUrl) ? string.Empty : newApplication.ApplicationUrl,
        ApplicationSourceUrl = string.IsNullOrEmpty(newApplication.ApplicationSourceUrl) ? string.Empty : newApplication.ApplicationSourceUrl,
        ApplicationIcon = string.IsNullOrEmpty(newApplication.ApplicationIcon) ? string.Empty : newApplication.ApplicationIcon,
        PublishDate = DateTime.UtcNow,
        // ApplicationImages = new List<ApplicationImage>()
    };

    // Save the application to the database to generate the ApplicationId
    var result = await _app.AddApplication(application);
    if (!result)
    {
        return NotFound("Application not added.");
    }
    return Ok("Application added successfully.");
}
    [HttpPost]
    [Route("addimages")]
    public async Task<ActionResult> AddImages([FromForm] ApplicationImagesDto imagesDto)
    {
        if (imagesDto == null || imagesDto.ApplicationId <= 0 || imagesDto.Images == null || !imagesDto.Images.Any())
        {
            return BadRequest("Invalid data provided.");
        }

        var imagePaths = new List<string>();
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        foreach (var image in imagesDto.Images)
        {
            var filePath = Path.Combine(uploadsFolder, image.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            imagePaths.Add(image.FileName);
        }

        var applicationImages = imagePaths.Select(imagePath => new ApplicationImage
        {
            ApplicationId = imagesDto.ApplicationId,
            ImagePath = imagePath
        }).ToList();

        await _app.AddApplicationImages(applicationImages);

        return Ok("Images added successfully.");
    }
    [HttpPost]
    [Authorize]
    [Route("uploadicon")]
    public async Task<IActionResult> UploadIcon([FromForm] IFormFile icon, [FromForm] int applicationId)
    {
        if (icon == null || applicationId <= 0)
        {
            return BadRequest("Invalid icon or application ID.");
        }
        
        var application =  _app.FindApplication(applicationId);
        if (application == null)
        {
            return NotFound("Application not found.");
        }
        
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }
        
        var filePath = Path.Combine(uploadsFolder, icon.FileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await icon.CopyToAsync(stream);
        }
        
        application.ApplicationIcon = icon.FileName;
        var result = await _app.EditApplication(application);
        if (result)
        {
            return Ok("Icon uploaded successfully.");
        }
        return NotFound("Icon not uploaded.");
      
    }
    [HttpGet]
    [Authorize]
    [Route("getlatesApps")]
    public IActionResult GetLatestApplications()
    {
        var applications = _app.GeLatestApplications();
        return Ok(applications);
    }
}


public class App
{
    public Application Application { get; set; }
    public List<ApplicationImage> ApplicationImages { get; set; }
    
}