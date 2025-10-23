// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
namespace CoreII.Interfaces.Application;

public interface IApplicationBusiness
{
   Data.Application GetApplication(string appName);
   List<Data.ApplicationImage> GetApplicationImages(string appName);
   List<Data.Application> GetApplications();
   Task<bool> EditApplication(Data.Application updatedApplication);
   Task<bool> DeleteApplication(int id);
   Task<bool>AddApplication(Data.Application newApplication);
   Task AddApplicationImages(ICollection<Data.ApplicationImage> applicationImages);
   Data.Application FindApplication(int applicationName);
   List<Data.Application> GeLatestApplications();
}