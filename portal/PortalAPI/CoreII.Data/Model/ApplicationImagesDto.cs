// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
namespace CoreII.Data;

public class ApplicationImagesDto
{
    public int ApplicationId { get; set; }
    public List<IFormFile>? Images { get; set; }
}