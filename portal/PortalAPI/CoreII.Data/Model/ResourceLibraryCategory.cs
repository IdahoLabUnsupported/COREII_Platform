// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.ComponentModel.DataAnnotations;

namespace CoreII.Data
{
    public class ResourceLibraryCategory
    {
        [Key] // Use Key attribute to specify the primary key
        public int Category_Id { get; set; }

        public string Category_Name { get; set; }

        // Navigation property for related rows
        public ICollection<ResourceLibrary> ResourceLibraries { get; set; }
    }
}

