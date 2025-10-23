// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreII.Data;


public class ApplicationImage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ApplicationImageId { get; set; }
    public string? ImagePath { get; set; }
    [ForeignKey(nameof(Application))]
    public int ApplicationId { get; set; }
    
    
    public Application Application { get; set; }
}