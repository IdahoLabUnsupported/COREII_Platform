// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System.ComponentModel.DataAnnotations;

namespace CoreII.Data;

public class DataUpload
{
    [Key]
    public int DataUploadId { get; set; }
    public string? File_Name { get; set; }
    public string? FilePath { get; set; }
    public int? FileSize { get; set; }
    public string? FileType { get; set; }
}