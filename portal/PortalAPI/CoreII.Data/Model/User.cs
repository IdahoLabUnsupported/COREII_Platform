// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.AspNetCore.Identity;

namespace CoreII.Data
{
    //User Portal, a local user structure seperate from okta
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [StringLength(100)]
        [Unicode(true)]
        public string? userName { get; set; }

        [StringLength(50)]
        [Unicode(true)]
        public string? firstName { get; set; }

        [StringLength(50)]
        [Unicode(true)]
        public string? lastName { get; set; }


        [Required]
        [StringLength(50)]
        [Unicode(true)]
        public string? email { get; set; }


        [Column(TypeName = "datetime")]
        public DateTime dateCreated { get; set; }


        public virtual ICollection<Role> roles { get; set; }

        public User()
        {
        }
    }
}

