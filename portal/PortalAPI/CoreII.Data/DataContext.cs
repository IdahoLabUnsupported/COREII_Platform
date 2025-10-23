// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CoreII.Data
{
    public class PortalContext : DbContext
    {
        private string _connectionString = null;
        private bool manualConfigured = false;
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            if (!optionsBuilder.IsConfigured || !manualConfigured)
            {
                if (_connectionString == null){}
                    string SQL_API_URL = Environment.GetEnvironmentVariable("SQL_API_URL");
                    string SQL_API_PORT = Environment.GetEnvironmentVariable("SQL_API_PORT");
                    string SQL_PASS = Environment.GetEnvironmentVariable("SQL_PASS");

                    

                    _connectionString =
                        "Data Source=" + SQL_API_URL + "," + SQL_API_PORT +";Initial Catalog=PORTAL;User ID=sa;Password=" + SQL_PASS + ";TrustServerCertificate=True";
                   
                _logger.LogInformation( _connectionString);
                optionsBuilder.UseSqlServer(_connectionString);
                manualConfigured = true;
            }
        }

        public PortalContext(ILogger<PortalContext> logger)
        {
        _logger = logger;
        }
        private readonly ILogger<PortalContext> _logger;
        public PortalContext(DbContextOptions<PortalContext> options,ILogger<PortalContext> logger)
        : base(options)
        {
        _logger = logger;
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public DbSet<ResourceLibrary> ResourceLibraries { get; set; }
        public DbSet<ResourceLibraryCategory> ResourceLibraryCategories { get; set; }
        public DbSet<DataUpload> DataUploads { get; set; }

        public DbSet<Application> Applications { get; set; }
        public DbSet<ApplicationImage> ApplicationImages { get; set; }
        public DbSet<AIModel> AIModels { get; set; }
        public DbSet<DatasetModels> DatasetModels { get; set; }
        public DbSet<ModSimDatasets> ModSimDatasets { get; set; }
        public DbSet<CoreIINews> CoreIINews { get; set; }

    }
}

