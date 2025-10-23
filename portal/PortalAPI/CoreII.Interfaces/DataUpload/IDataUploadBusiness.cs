// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using CoreII.Data;

namespace CoreII.Interfaces.DataUpload;

public interface IDataUploadBusiness
{
    Task<Data.DataUpload> AddDataUpload(Data.DataUpload dataUpload);
    Task<bool> AddAIModel(AIModel aIModel);
    List<Data.AIModel> GetAIModels();
    List<Data.DatasetModels> GetDatasets();
    Task<bool> AddDatasetsUpload(DatasetModels datasetModels);
    List<Data.ModSimDatasets> GetModSim();
    Task<bool> AddModSimUpload(ModSimDatasets modSimDatasets);
    Task<bool> UpdateAppNews(Data.ApplicationCORENews updatedApplication);
    Task<bool> CoreIINewsUpload(CoreIINews coreIINews); 
    List<Data.CoreIINews> GetLatestCoreIINews();
    Task<bool> UpdateAIModel(AIModel updatedModel);
    Task<bool> DeleteAIModel(int id);
    Task<bool> UpdateDataset(DatasetModels updatedDataset);
    Task<bool> DeleteDataset(int id);
    Task<bool> UpdateModSim(ModSimDatasets updatedModSim);
    Task<bool> DeleteModSim(int id);
    Task<bool> DeleteCoreIINews(int id);
    Task<bool> EditCORENews(CoreIINews updatedNews);
    Task<bool> UpdateExistingAppNews(ApplicationCORENews updatedNews);
    // Instead of deleting the entire application, we clear its news field.
    Task<bool> ClearAppNews(int id);
}