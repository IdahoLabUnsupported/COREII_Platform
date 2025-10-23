// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using CoreII.Interfaces;
using CoreII.Models;
using System.Collections.Generic;
using System.Xml.Xsl;
using CoreII.Data;
using System.Linq;
using System.Data;
using Microsoft.EntityFrameworkCore;
using CoreII.Business.DataConversionExtensions;

namespace CoreII.Business
{
	public class UserRoleBusiness : IUserRoleBusiness
    {

        private PortalContext _context;

        public UserRoleBusiness(PortalContext context)
        {
            _context = context;
        }
		public UserRoleBusiness()
		{
        }

        //------------------ Users ------------------

        //Get all users
        public List<UserModel> getUsers()
        {
            List<UserModel> retVal = new List<UserModel>();

            var users = _context.Users.Include(a => a.roles).ToList();

            foreach (User user in users)
            {
                retVal.Add(user.toModel());

            }
            return retVal;
        }

        //Get individual user based on id
        public UserModel? getUser(int id)
        {

            var user  = _context.Users.Include(a => a.roles).Where(u => u.id == id).FirstOrDefault();
            if (user == null) { return null; }
            UserModel retVal = user.toModel();
            return retVal;
        }

        //Add User,
        //Returns the new users Id if successful
        //returns 0 if failed
        public int addUser(UserModel input)
		{
            User newUser = new User();
            newUser.updateDbBaseUser(input);
            newUser.dateCreated = DateTime.Now;
            _context.Users.Add(newUser);
            _context.SaveChanges();
			return newUser.id;
		}

		//Update User, returns the updated user model
		//pulled from the db to ensure the frontend
		//matches up directly with whats in the db
		//Returns null if an error occured
		public UserModel? updateUserBasics(UserModel input)
		{
			var userToUpdate = _context.Users.Where(a => a.id == input.id).FirstOrDefault();
			if (userToUpdate == null) { return null; }

			userToUpdate.updateDbBaseUser(input);
			_context.SaveChanges();

			return _context.Users.Where(u => u.id == input.id)
				.FirstOrDefault()?.toModel() ??
				null;
		}
        //Update Users roles, returns a new user model
        //of what has been saved to the db.
        //Returns null if an error occured
        public UserModel? updateUserRoles(UserModel input)
        {
            var userToUpdate = _context.Users.Include(a => a.roles).Where(a => a.id == input.id).FirstOrDefault();
            if (userToUpdate == null) { return null; }

            var roles = _context.Roles.ToList();

            userToUpdate.updateDbRoles(input, roles);
            _context.SaveChanges();

            return _context.Users.Where(u => u.id == input.id)
				.FirstOrDefault()?.toModel() ??
				null;
        }

        public bool deleteUser(int id)
        {
            //if(checkIfCanDeleteUser()) { return false; }
            var userToDelete = _context.Users.Where(a => a.id == id).FirstOrDefault();
            if(userToDelete == null) { return false; }
            _context.Users.Remove(userToDelete);
            return _context.SaveChanges() > 0;

        }


        //------------------ Roles ------------------

        //Get AllRoles
        public List<RoleModel> getRoles()
        {
            List<RoleModel> retVal = new List<RoleModel>();
            foreach(var role in _context.Roles.ToList())
            {
                retVal.Add(role.toModel());
            }
            return retVal;
        }

        public RoleModel? getRole(int id)
        {
            var role = _context.Roles.Where(a => a.id == id).FirstOrDefault();
            if(role == null) { return null; }
            return role.toModel();
        }

        public int addRole(RoleModel inputModel)
        {
            var roleToAdd = new Role();
            roleToAdd.updateDb(inputModel);
            roleToAdd.dateCreated = DateTime.Now;
            _context.Roles.Add(roleToAdd);
            _context.SaveChanges();
            return roleToAdd.id;
        }

        public RoleModel? updateRole(RoleModel inputModel)
        {
            var roleToUpdate = _context.Roles.Where(a => a.id == inputModel.id).FirstOrDefault();
            if(roleToUpdate == null) { return null; }

            roleToUpdate.updateDb(inputModel);
            _context.SaveChanges();

            var retVal = _context.Roles.Where(a => a.id == roleToUpdate.id).FirstOrDefault()?.toModel();
            if(retVal == null) { return null; }

            return retVal;
        }

        public bool deleteRole(int id)
        {
            //if(checkIfCanDeleteRole()) { return false; }
            var roleToDelete = _context.Roles.Where(a => a.id == id).FirstOrDefault();
            if (roleToDelete == null) { return false; }
            _context.Roles.Remove(roleToDelete);
            return  _context.SaveChanges() > 0;
            
        }

        //------------------ Helper Methods ------------------ 
        private List<int> permissionStringToList(string input)
		{
			return input.Split(',').Select(int.Parse).ToList();
        }

		private List<int> getUserPermissions(List<Role> input)
		{
			var uniqueRoles = new HashSet<int>();
			foreach(Role role in input)
			{
				foreach(int val in permissionStringToList(role.permissions)){
					uniqueRoles.Add(val);
				}
			}
			return uniqueRoles.ToList();
		}
	}
}

