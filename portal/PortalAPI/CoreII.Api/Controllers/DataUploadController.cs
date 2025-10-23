// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using CoreII.Data;
using CoreII.Interfaces.DataUpload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CoreIIApi.Controllers;

[Route("api/dataUpload")]
[ApiController]
public class DataUploadController : Controller
{
    private readonly IDataUploadBusiness _uploadBusiness;
    public DataUploadController(IDataUploadBusiness uploadBusiness)
    {
        _uploadBusiness = uploadBusiness;
    }

    [HttpPost]
    [Authorize]
    [Route("postDataUpload")]
    public async Task<IActionResult> PostDataUpload([FromForm]List<IFormFile> file)
    {
        try
        {


            long size = file.Sum(f => f.Length);
            foreach (var formFile in file)
            {
                if (formFile.Length > 0)
                {
                    var fileName = Path.GetFileName(formFile.FileName);
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", fileName);
                    using (var stream = System.IO.File.Create(filePath))
                    {
                        var task = formFile.CopyToAsync(stream);
                        task.Wait();
                        var dataUpload = new DataUpload()
                        {
                            File_Name = Path.GetFileNameWithoutExtension(formFile.FileName),
                            FilePath = fileName,
                            FileSize = (int)formFile.Length,
                            FileType = formFile.ContentType
                        };
                        var result = await _uploadBusiness.AddDataUpload(dataUpload);

                    }

                }
            }

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex}");
        }

    }
    [HttpPost]
    [Authorize]
    [Route("aiUploads")]

    public async Task<ActionResult> AddAIModels([FromForm] AINewsDto newAiIModel)
    {
        if (newAiIModel == null)
        {
            return BadRequest("No application data provided for update.");
        }

        var aIModel = new AIModel
        {
            AIModelName = string.IsNullOrEmpty(newAiIModel.AIModelName) ? string.Empty : newAiIModel.AIModelName,
            AIModelDescription=string.IsNullOrEmpty(newAiIModel.AIModelDescription) ? string.Empty : newAiIModel.AIModelDescription,
            AIModelPublishDate =DateTime.UtcNow
        };

        // Save the AIModel to the database to generate the ApplicationId
        var result = await _uploadBusiness.AddAIModel(aIModel);
        if (!result)
        {
            return NotFound("Application not added.");
        }
        return Ok("Application added successfully.");
    }
    [HttpGet]
    [Authorize]
    [Route("getAIModels")]
    public IActionResult GetAIModels()
    {
        var getAiModels = _uploadBusiness.GetAIModels();
        return Ok(getAiModels);
    }
    [HttpGet]
    [Authorize]
    [Route("getDataset")]
    public IActionResult GetDatasets()
    {
        var getDatasets = _uploadBusiness.GetDatasets();
        return Ok(getDatasets);
    }
    [HttpPost]
    [Authorize]
    [Route("datasetsUploads")]

    public async Task<ActionResult> DatasetUploads([FromForm] DatasetModels newDatasetModel)
    {
        if (newDatasetModel == null)
        {
            return BadRequest("No application data provided for update.");
        }

        var datasetModels = new DatasetModels
        {
           Title = string.IsNullOrEmpty(newDatasetModel.Title) ? string.Empty : newDatasetModel.Title,
            Description= string.IsNullOrEmpty(newDatasetModel.Description) ? string.Empty : newDatasetModel.Description,
            DatasetodelPublishDate = DateTime.UtcNow,
            Url=string.IsNullOrEmpty(newDatasetModel.Url) ? string.Empty : newDatasetModel.Url,
        };

        // Save the AIModel to the database to generate the ApplicationId
        var result = await _uploadBusiness.AddDatasetsUpload(datasetModels);
        if (!result)
        {
            return NotFound("Dataset not added.");
        }
        return Ok("Dataset added successfully.");
    }
    [HttpGet]
    [Authorize]
    [Route("getModSim")]
    public IActionResult GetModSim()
    {
        var getModSim = _uploadBusiness.GetModSim();
        return Ok(getModSim);
    }
    [HttpPost]
    [Authorize]
    [Route("modSimUploads")]
    
    public async Task<ActionResult> ModSimUploads([FromForm] ModSimDatasets newModSimDatasets)
    {
        if (newModSimDatasets == null)
        {
            return BadRequest("No application data provided for update.");
        }
    
        var modSimDatasets = new ModSimDatasets
        {
            Title = string.IsNullOrEmpty(newModSimDatasets.Title) ? string.Empty : newModSimDatasets.Title,
            Content= string.IsNullOrEmpty(newModSimDatasets.Content) ? string.Empty : newModSimDatasets.Content,
            ModSimPublishDate = DateTime.UtcNow,
            Url=string.IsNullOrEmpty(newModSimDatasets.Url) ? string.Empty : newModSimDatasets.Url,
        };
    
        // Save the AIModel to the database to generate the ApplicationId
        var result = await _uploadBusiness.AddModSimUpload(modSimDatasets);
        if (!result)
        {
            return NotFound("Application not added.");
        }
        return Ok("Application added successfully.");
    }

    [HttpPost]
    [Authorize]
    [Route("updateAppNews")]
    public async Task<IActionResult> UpdateAppNews([FromForm]ApplicationCORENews updatedApplication)
    {
        var app = new ApplicationCORENews
        {
            ApplicationId = updatedApplication.ApplicationId,
            ApplicationNews = updatedApplication.ApplicationNews,
            PublishDate = DateTime.UtcNow,
        };
        var result = await _uploadBusiness.UpdateAppNews(app);
        if (result)
        {
            return Ok("Application updated successfully.");
        }
        else
        {
            return NotFound($"Application with ID {updatedApplication.ApplicationId} not found.");
        }
    }
    [HttpPost]
    [Authorize]
    [Route("updateCoreIINews")]
    public async Task<IActionResult> UpdateCoreIINews([FromForm] string newsContent)
    {
        if (string.IsNullOrWhiteSpace(newsContent))
        {
            return BadRequest("COREII News cannot be empty.");
        }

        var coreiiNews = new CoreIINews
        {
            NewsContent = newsContent,
            PublishDate = DateTime.UtcNow,
        };
          var result= await _uploadBusiness.CoreIINewsUpload(coreiiNews);
        
          if (!result)
          {
              return NotFound("COREII news not added.");
          }
        return Ok("COREII News updated successfully.");
    }
    [HttpGet]
    [Authorize]
    [Route("getLatestCoreIINews")]
    public IActionResult GetLatestCoreIINews()
    {
        var results = _uploadBusiness.GetLatestCoreIINews();
        return Ok(results);
    }
    [HttpPost]
    [Authorize]
    [Route("updateAiModel")]
        public async Task<IActionResult> UpdateAiModel([FromForm] AIModel updatedModel)
        {
            if (updatedModel == null)
            {
                return BadRequest("No data provided for update.");
            }
            var result = await _uploadBusiness.UpdateAIModel(updatedModel);
            if (result)
                return Ok("AI Model updated successfully.");
            else
                return NotFound("AI Model not found.");
        }

     [HttpDelete]
    [Authorize]
    [Route("deleteAiModel/{id}")]
        public async Task<IActionResult> DeleteAiModel(int id)
        {
            var result = await _uploadBusiness.DeleteAIModel(id);
            if (result)
                return Ok("AI Model deleted successfully.");
            else
                return NotFound("AI Model not found.");
        }
        
     [HttpPut]
    [Authorize]
    [Route("updateDataset")]
        public async Task<IActionResult> UpdateDataset([FromForm] DatasetModels updatedDataset)
        {
            if (updatedDataset == null)
            {
                return BadRequest("No data provided for update.");
            }
            var result = await _uploadBusiness.UpdateDataset(updatedDataset);
            if (result)
                return Ok("Dataset updated successfully.");
            else
                return NotFound("Dataset not found.");
        }

    [HttpDelete]
    [Authorize]
    [Route("deleteDataset/{id}")]
        public async Task<IActionResult> DeleteDataset(int id)
        {
            var result = await _uploadBusiness.DeleteDataset(id);
            if (result)
                return Ok("Dataset deleted successfully.");
            else
                return NotFound("Dataset not found.");
        }

    [HttpPut]
    [Authorize]
    [Route("updateModSim")]
        public async Task<IActionResult> UpdateModSim([FromForm] ModSimDatasets updatedModSim)
        {
            if (updatedModSim == null)
            {
                return BadRequest("No data provided for update.");
            }
            var result = await _uploadBusiness.UpdateModSim(updatedModSim);
            if (result)
                return Ok("MOD/SIM data updated successfully.");
            else
                return NotFound("MOD/SIM data not found.");
        }

    [HttpDelete]
    [Authorize]
    [Route("deleteModSim/{id}")]
        public async Task<IActionResult> DeleteModSim(int id)
        {
            var result = await _uploadBusiness.DeleteModSim(id);
            if (result)
                return Ok("MOD/SIM data deleted successfully.");
            else
                return NotFound("MOD/SIM data not found.");
        }
    [HttpDelete]
    [Authorize]
    [Route("deleteCoreIINews/{id}")]
        public async Task<IActionResult> DeleteCoreNews(int id)
        {
            var result = await _uploadBusiness.DeleteCoreIINews(id);
            if (result)
                return Ok("COREII news deleted successfully.");
            else
                return NotFound("COREII news not found.");
        }
    [HttpPost]
    [Authorize]
    [Route("editCoreIINews")]
        public async Task<IActionResult> EditCoreIINews([FromForm] CoreIINews updatedNews)
        {
            
            var result = await _uploadBusiness.EditCORENews(updatedNews);
            if (result)
                return Ok("News updated successfully.");
            else
                return NotFound("News not found.");
        }
    [HttpPut]
    [Authorize]
    [Route("updateExistingAppNews")]
        public async Task<IActionResult> UpdateExistingAppNews([FromForm] ApplicationCORENews updatedNews)
        {
            if (updatedNews == null || updatedNews.ApplicationId == 0)
            {
                return BadRequest("No data provided for update.");
            }

            var result = await _uploadBusiness.UpdateExistingAppNews(updatedNews);
            if (result)
            {
                return Ok("Application news updated successfully.");
            }
            else
            {
                return NotFound($"Application news with ID {updatedNews.ApplicationId} not found.");
            }
        }
        
    [HttpDelete]
    [Authorize]
    [Route("deleteApplicationNews/{id}")]
        public async Task<IActionResult> DeleteApplicationNews(int id)
        {
            var result = await _uploadBusiness.ClearAppNews(id);
            if (result)
                return Ok("Application news deleted successfully.");
            else
            return NotFound("Application news not found.");
        }
}
