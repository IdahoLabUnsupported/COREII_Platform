// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreII.Data;

public class Application
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ApplicationId { get; set; }
    public string ApplicationName { get; set; }
    public string? TextWorks { get; set; }
    public string? TextData { get; set; }
    public string? TextHelps { get; set; }
    public string? TextSummary { get; set; }
    public int Tlr { get; set; }
    public string ApplicationUrl { get; set; }
    public string ApplicationSourceUrl { get; set; }
    public string ApplicationIcon { get; set; }
    public DateTime? PublishDate { get; set; }
    public string? ApplicationNews { get; set; }
    public ICollection<ApplicationImage> ApplicationImages { get; set; }
}