// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Collections.Generic;
using CoreII.Models;
namespace CoreII.Interfaces
{
	public interface IUserRoleBusiness
    {
        //Users
        public List<UserModel> getUsers();
        public UserModel getUser(int id);
        public int addUser(UserModel input);
		public UserModel? updateUserBasics(UserModel input);
		public UserModel? updateUserRoles(UserModel input);
        public bool deleteUser(int id);

        //Roles
        public List<RoleModel> getRoles();
        public RoleModel getRole(int id);
        public int addRole(RoleModel inputModel);
        public RoleModel? updateRole(RoleModel inputModel);
        public bool deleteRole(int id);
    }
}



