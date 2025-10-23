// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
namespace CoreII.Models
{
	public class RoleModel
	{
		public int id { get; set; }
		public string? name { get; set; }
		public string? description { get; set; }
		public DateTime? dateCreated { get; set; }
		public List<int>? permissions { get; set; }
		public List<UserModel>? users { get; set; }

		public RoleModel()
		{
		}
	}
}

