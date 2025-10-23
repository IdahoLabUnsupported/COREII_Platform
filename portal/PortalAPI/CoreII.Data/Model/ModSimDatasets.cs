// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
namespace CoreII.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


public class ModSimDatasets
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public DateTime? ModSimPublishDate { get; set; } = DateTime.UtcNow;
    public string? Url { get; set; }
}