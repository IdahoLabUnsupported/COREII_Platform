// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using CoreII.Models;
using CoreII.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CoreIIApi.Data
{
    public class DataContext:IdentityDbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
          
        }
        public DbSet<ResourceLibrary> ResourceLibraries { get; set; }
        public DbSet<ResourceLibraryCategory> ResourceLibraryCategories { get; set; }

    }
}

