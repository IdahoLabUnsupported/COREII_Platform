// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreII.Data
{
    //Role Portal, a local role strucuture seperate from okta
    public class Role
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [StringLength(50)]
        [Unicode(true)]
        public string name { get; set; }

        [StringLength(300)]
        [Unicode(true)]
        public string description { get; set; }


        [Column(TypeName = "datetime")]
        public DateTime dateCreated { get; set; }

        public virtual ICollection<User> users { get; set; }

        //Should be a new table for this but were going to
        //make this easy for the moment and just do a csv
        public string permissions { get; set; }



        public Role()
        {

        }
    }
}

