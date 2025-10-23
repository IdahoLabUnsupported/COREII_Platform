// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CoreII.Data
{
    public class ResourceLibrary
    {
        [Key]
        public int File_Id { get; set; }
        public string? File_Name { get; set; }
        public string? Title { get; set; }
        public string? Name { get; set; }
        public string? Comments { get; set; }
        public string? Description { get; set; }
        public string? Short_Name { get; set; }
        public DateTime? Publish_Date { get; set; }
        public string? Doc_Version { get; set; }
        public string? Summary { get; set; }
        public string? Source_Type { get; set; }
        public string? FilePath { get; set; }

        // Use ForeignKey attribute to specify the foreign key
        [ForeignKey(nameof(ResourceLibraryCategory))]
        public int Category_Id { get; set; }

        // Navigation property
        public ResourceLibraryCategory ResourceLibraryCategory { get; set; }
    }

}

