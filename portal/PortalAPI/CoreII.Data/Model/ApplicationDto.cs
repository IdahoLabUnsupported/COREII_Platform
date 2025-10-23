// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
namespace CoreII.Data;

// public class ApplicationDto
// {
//     
//     public string ApplicationName { get; set; }
//     public string? TextWorks { get; set; }
//     public string? TextData { get; set; }
//     public string? TextHelps { get; set; }
//     public string? TextSummary { get; set; }
//     public int Tlr { get; set; }
//     public string? ApplicationUrl { get; set; }
//     public string? ApplicationSourceUrl { get; set; }
//     public string? ApplicationIcon { get; set; }
//     public List<IFormFile>? ApplicationImages { get; set; }
// }
public class ApplicationDto
{
    public string ApplicationName { get; set; }
    public string? TextWorks { get; set; }
    public string? TextData { get; set; }
    public string? TextHelps { get; set; }
    public string? TextSummary { get; set; }
    public int Tlr { get; set; }
    public string? ApplicationUrl { get; set; }
    public string? ApplicationSourceUrl { get; set; }
    public string? ApplicationIcon { get; set; }
    
    public List<string>? applicationImages { get; set; }
}