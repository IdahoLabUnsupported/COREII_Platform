// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
namespace CoreII.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AIModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int AIModelId { get; set; }
    public string AIModelName { get; set; }
    public string? AIModelDescription { get; set; }
    public DateTime? AIModelPublishDate { get; set; }
    public string? Category { get; set; }
    public string? Creator  { get; set; }
    public string? url { get; set; }

}