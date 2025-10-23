// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using CoreII.Data;
using CoreII.Interfaces.Application;
using Microsoft.EntityFrameworkCore;

namespace CoreII.Business.Applications;

public class ApplicationBusiness : IApplicationBusiness
{
    private PortalContext _context;

    public ApplicationBusiness(PortalContext context)
    {
        _context = context;
    }

    public Application GetApplication(string appName)
    {
        var application = _context.Applications.FirstOrDefault(a => a.ApplicationName.ToUpper() == appName);
        return application?? new Application();
    }
    
    public List<ApplicationImage> GetApplicationImages(string appName)
    {
        var images = _context.ApplicationImages.Where(a => a.Application.ApplicationName == appName).ToList();
        return images;
    }
    
    public List<Application> GetApplications()
    {
        var applications = _context.Applications.ToList();
        return applications;
    }
    public async Task<bool> EditApplication(Application updatedApplication)
    {
        var existingApp = await _context.Applications.FindAsync(updatedApplication.ApplicationId);
        if (existingApp != null)
        {
            existingApp.ApplicationName = updatedApplication.ApplicationName;
            existingApp.ApplicationSourceUrl = updatedApplication.ApplicationSourceUrl;
            existingApp.TextData = updatedApplication.TextData;
            existingApp.TextHelps = updatedApplication.TextHelps;
            existingApp.TextSummary = updatedApplication.TextSummary;
            existingApp.TextWorks = updatedApplication.TextWorks;
            existingApp.ApplicationIcon = updatedApplication.ApplicationIcon;
            existingApp.Tlr=updatedApplication.Tlr;
            existingApp.ApplicationNews = updatedApplication.ApplicationNews;
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }
    public async Task<bool> DeleteApplication(int id)
    {
        var existingApp = await _context.Applications.FindAsync(id);
        if (existingApp != null)
        {
            _context.Applications.Remove(existingApp);
            await _context.SaveChangesAsync();
            return true;
        }
        return false;
    }
    public async Task<bool>AddApplication(Application newApplication)
    {
        if (newApplication==null)
        {
            return false;
        }
        _context.Applications.Add(newApplication);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task AddApplicationImages(ICollection<ApplicationImage> applicationImages)
    {
        _context.ApplicationImages.AddRange(applicationImages);
        await _context.SaveChangesAsync();
    }
    public Application FindApplication(int applicationId)
    {
        var application = _context.Applications.FirstOrDefault(a => a.ApplicationId == applicationId);
        return application;
    }
    public List<Application> GeLatestApplications()
    {
        var latestApps = _context.Applications.OrderByDescending(model => model.PublishDate)
            .Where(model => model.PublishDate != null && ! string.IsNullOrEmpty(model.ApplicationNews)) 
            .OrderByDescending(model => model.PublishDate) 
            .Take(3) 
            .AsNoTracking() // Optimize performance
            .ToList();
        return latestApps;
        var applications = _context.Applications.ToList();
        return applications;
    }
    
}