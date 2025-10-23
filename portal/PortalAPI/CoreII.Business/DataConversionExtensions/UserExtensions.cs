// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using CoreII.Data;
using CoreII.Models;
using Microsoft.AspNetCore.Components.Forms;

namespace CoreII.Business.DataConversionExtensions
{
	public static class UserExtensions
	{
		public static UserModel toModel(this User input)
		{
			UserModel retVal = new UserModel();
			retVal.id = input.id  == 0 ? 0 : input.id;
			retVal.email = input.email ?? "";
            retVal.userName = input.userName ?? "";
            retVal.firstName = input.firstName ?? "";
            retVal.lastName = input.lastName ?? "";
			retVal.dateCreated = input.dateCreated;
			

			if(input.roles != null)
			{
				retVal.roles = input.roles.Select(role => new RoleModel()
				{
					id = role.id,
					name = role.name,
					permissions = role.permissions.Split(",").Select(int.Parse).ToList()
				}).ToList();

            }

			return retVal;
        }

        public static User updateDbBaseUser(this User user, UserModel userModel)
        {
            user.userName = userModel.userName;
            user.firstName = userModel.firstName;
            user.lastName = userModel.lastName;
			user.email = userModel.email;
            user.dateCreated = userModel.dateCreated == null ? DateTime.Now : (DateTime)userModel.dateCreated;
            return user;
        }
        public static User updateDbRoles(this User user, UserModel userModel, List<Role> roles)
        {
			//Go through the list of roles in the db as is, and remove
			//any that are not in the new list from the user model.
			//Go through the new list and add any that dont currently exist
			//Got to be a better way of doing this
			foreach(var oldRole in user.roles)
			{
				//check if the old role exists in the new usermodel
				if(userModel.roles.Where(a => a.id == oldRole.id).FirstOrDefault() == null)
				{
					user.roles.Remove(oldRole);
				}
			}
			foreach(var usedrole in userModel.roles)
			{
				//check if new role exists in the old list
				if(user.roles.Where(a => a.id == usedrole.id).FirstOrDefault() == null)
				{
					var roleToAdd = roles.Where(i => i.id == usedrole.id).FirstOrDefault();
					if (roleToAdd != null) { user.roles.Add(roleToAdd); }   
				}
			}

            return user;
        }
    }
}

