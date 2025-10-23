// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
namespace CoreII.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class DatasetModels
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? DatasetodelPublishDate { get; set; } = DateTime.UtcNow;
    public string? Url { get; set; }

}