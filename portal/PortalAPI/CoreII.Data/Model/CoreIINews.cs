// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreII.Data
{
    public class CoreIINews
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NewsId { get; set; }

        public string? NewsContent { get; set; } 

        public DateTime?  PublishDate { get; set; } = DateTime.UtcNow;
    }
}