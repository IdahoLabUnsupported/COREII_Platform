// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
namespace CoreII.Models
{
	public class UserModel
    {

        public int id { get; set; }
        public string email { get; set; }
        public string userName { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public DateTime? dateCreated { get; set; }
        public List<RoleModel>? roles {get; set;}
		
		public UserModel()
		{
		}


	}
}

