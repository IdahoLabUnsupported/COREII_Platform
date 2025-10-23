// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using CoreII.Data;
using CoreII.Models;
namespace CoreII.Business.DataConversionExtensions
{
	public static class RoleExtensions
	{
		public static RoleModel toModel(this Role input)
		{
			RoleModel retVal = new RoleModel();
			retVal.id = input.id;
			retVal.name = input.name;
			retVal.permissions = input.permissions.Split(',').Select(int.Parse).ToList();
			retVal.description = input.description;
			retVal.dateCreated = input.dateCreated;
            if(input.users != null)
			{
                retVal.users = input.users.Select(role => new UserModel()
                {
                    id = role.id,
					userName = role.userName
                }).ToList();
            }

            return retVal;
		}

		public static Role updateDb(this Role inputRole, RoleModel inputRoleModel)
		{
			inputRole.name = inputRoleModel.name;
			inputRole.description = inputRoleModel.description;
            inputRole.dateCreated = inputRoleModel.dateCreated == null ? DateTime.Now : (DateTime)inputRoleModel.dateCreated;
			inputRole.permissions = String.Join(",", inputRoleModel.permissions);
			//Not updating users from the roles side
			//If needed, take a look at the userextension example 
			return inputRole;
        }
	}
}

