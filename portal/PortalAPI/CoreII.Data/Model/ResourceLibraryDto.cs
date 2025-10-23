// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
namespace CoreII.Data
{
    public class ResourceLibraryDto
    {
        public int FileId { get; set; }
        public string? FileName { get; set; }
        public string? Title { get; set; }
        // public string? Name { get; set; }
        public string? Comments { get; set; }
        // public string? Description { get; set; }
        // public string? ShortName { get; set; }
        public DateTime? PublishDate { get; set; }
        // public string? DocVersion { get; set; }
        public string? Summary { get; set; }
        // public string? SourceType { get; set; }
        // public string? FilePath { get; set; }
        // public string? CategoryName { get; set; }
        public int CategoryId { get; set; }
    }

}

