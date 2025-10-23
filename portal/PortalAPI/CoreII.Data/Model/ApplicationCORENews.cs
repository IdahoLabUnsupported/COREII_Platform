// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
namespace CoreII.Data;

public class ApplicationCORENews
{
    public int ApplicationId { get; set; }
    public string? ApplicationNews { get; set; }
    public DateTime?  PublishDate { get; set; } = DateTime.UtcNow;
}