// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using CoreII.Data;
using CoreII.Interfaces.DataUpload;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace CoreII.Business.DataUpload;

public class DataUploadBusiness : IDataUploadBusiness
{
    private readonly PortalContext _context;
    public DataUploadBusiness(PortalContext context)
    {
        _context = context;
    }
    
    public async Task<Data.DataUpload> AddDataUpload(Data.DataUpload dataUpload)
    {
        _context.DataUploads.Add(dataUpload);
        await _context.SaveChangesAsync();
        return dataUpload;
    }
    
    public async Task<bool>AddAIModel(AIModel newIMode)
    {
        if (newIMode==null)
        {
            return false;
        }
        _context.AIModels.Add(newIMode);
        await _context.SaveChangesAsync();
        return true;
    }
    public List<AIModel> GetAIModels()
    {
        var aiModels = _context.AIModels.OrderByDescending(model => model.AIModelPublishDate)
            .Where(model => model.AIModelPublishDate != null) // Ensure valid date
            .OrderByDescending(model => model.AIModelPublishDate) // Sort by newest first
            .Take(3) 
            .AsNoTracking() // Optimize performance
            .ToList();
        return aiModels;
    }
    public List<DatasetModels> GetDatasets()
    {
        var datasetModels = _context.DatasetModels.OrderByDescending(model => model.DatasetodelPublishDate)
            .Where(model => model.DatasetodelPublishDate != null) // Ensure valid date
            .OrderByDescending(model => model.DatasetodelPublishDate) // Sort by newest first
            .Take(3)
            .AsNoTracking() // Optimize performance
            .ToList();
        return datasetModels;
    }
    public async Task<bool> AddDatasetsUpload(Data.DatasetModels datasetsModelsUpload)
    {
        _context.DatasetModels.Add(datasetsModelsUpload);
        await _context.SaveChangesAsync();
        return true;
    }
    public List<ModSimDatasets> GetModSim()
    {
        var modSimModels = _context.ModSimDatasets.OrderByDescending(model => model.ModSimPublishDate)
            .Where(model => model.ModSimPublishDate != null) // Ensure valid date
            .OrderByDescending(model => model.ModSimPublishDate) // Sort by newest first
            .Take(3) 
            .AsNoTracking() // Optimize performance
            .ToList();
        return modSimModels;
    }
    public async Task<bool> AddModSimUpload(Data.ModSimDatasets modSimDatasets)
    {
        _context.ModSimDatasets.Add(modSimDatasets);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> UpdateAppNews(ApplicationCORENews updatedApplication)
    {
        var existingApp = await _context.Applications.FindAsync(updatedApplication.ApplicationId);
        if (existingApp != null)
        {
            existingApp.ApplicationNews = updatedApplication.ApplicationNews;
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }

    public async Task<bool> CoreIINewsUpload(CoreIINews coreIINews)
    {
        _context.CoreIINews.Add(coreIINews);
        await _context.SaveChangesAsync();
        return true;
    }
    public List<CoreIINews> GetLatestCoreIINews()
    {
        var latestNews = _context.CoreIINews.OrderByDescending(model => model.NewsContent)
            .Where(model => model.PublishDate != null) // Ensure valid date
            .OrderByDescending(model => model.PublishDate) // Sort by newest first
            .Take(3) 
            .AsNoTracking() // Optimize performance
            .ToList();
        return latestNews;
    }
    
      // AI Model Update & Delete
        public async Task<bool> UpdateAIModel(AIModel updatedModel)
        {
            var existingModel = await _context.AIModels.FindAsync(updatedModel.AIModelId);
            if(existingModel == null)
                return false;

            existingModel.AIModelName = updatedModel.AIModelName;
            existingModel.AIModelDescription = updatedModel.AIModelDescription;
            existingModel.Category = updatedModel.Category;
            existingModel.Creator = updatedModel.Creator;
            existingModel.url = updatedModel.url;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAIModel(int id)
        {
            var model = await _context.AIModels.FindAsync(id);
            if(model == null)
                return false;
            _context.AIModels.Remove(model);
            await _context.SaveChangesAsync();
            return true;
        }

        // Dataset Update & Delete
        public async Task<bool> UpdateDataset(DatasetModels updatedDataset)
        {
            var existingDataset = await _context.DatasetModels.FindAsync(updatedDataset.Id);
            if(existingDataset == null)
                return false;
            existingDataset.Title = updatedDataset.Title;
            existingDataset.Description = updatedDataset.Description;
            existingDataset.Url = updatedDataset.Url;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDataset(int id)
        {
            var dataset = await _context.DatasetModels.FindAsync(id);
            if(dataset == null)
                return false;
            _context.DatasetModels.Remove(dataset);
            await _context.SaveChangesAsync();
            return true;
        }

        // MOD/SIM Update & Delete
        public async Task<bool> UpdateModSim(ModSimDatasets updatedModSim)
        {
            var existingModSim = await _context.ModSimDatasets.FindAsync(updatedModSim.Id);
            if(existingModSim == null)
                return false;
            existingModSim.Title = updatedModSim.Title;
            existingModSim.Content = updatedModSim.Content;
            existingModSim.Url = updatedModSim.Url;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteModSim(int id)
        {
            var modSim = await _context.ModSimDatasets.FindAsync(id);
            if(modSim == null)
                return false;
            _context.ModSimDatasets.Remove(modSim);
            await _context.SaveChangesAsync();
            return true;
        }

        // Optionally, add deletion for news if needed...
        public async Task<bool> DeleteAppNews(int id)
        {
            var appNews = await _context.Applications.FindAsync(id);
            if(appNews == null)
                return false;
            _context.Applications.Remove(appNews);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> EditCORENews(CoreIINews updatedNews)
        {
            var existingNews = await _context.CoreIINews.FindAsync(updatedNews.NewsId);
            if(existingNews == null)
                return false;
            existingNews.NewsContent = updatedNews.NewsContent;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteCoreIINews(int id)
        {
            var coreNews = await _context.CoreIINews.FindAsync(id);
            if(coreNews == null)
                return false;
            _context.CoreIINews.Remove(coreNews);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateExistingAppNews(ApplicationCORENews updatedNews)
        {
            var existingNews = await _context.Applications.FindAsync(updatedNews.ApplicationId);
            if (existingNews == null)
                return false;
            
            existingNews.ApplicationNews = updatedNews.ApplicationNews;
            existingNews.PublishDate = DateTime.UtcNow; 

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ClearAppNews(int id)
        {
            var appNews = await _context.Applications.FindAsync(id);
            if (appNews == null)
                return false;
            appNews.ApplicationNews = string.Empty;
            await _context.SaveChangesAsync();
            return true;
        }
}