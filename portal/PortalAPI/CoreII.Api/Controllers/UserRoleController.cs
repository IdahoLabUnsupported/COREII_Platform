// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Azure;
using CoreII.Data;
using CoreII.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using CoreII.Business;
using CoreII.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreIIApi.Controllers
{
    [Route("api/userRole")]
    [ApiController]
    public class UserRoleController : Controller
    {


        private PortalContext _context;
        private IUserRoleBusiness _userRoleManager;
        //private DataExecutionResult result;

        public UserRoleController(PortalContext context, IUserRoleBusiness UserRoleBusiness)
        {
            _context = context;
            _userRoleManager = UserRoleBusiness;
        }

        //----------------- User Methods -----------------
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            List<UserModel> users = _userRoleManager.getUsers();
            return Ok(users);
        }
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            UserModel? user = _userRoleManager.getUser(id);
            if(user == null) { return BadRequest($"Could not find user at id: {id}"); }
            return Ok(user);
        }

        [HttpPost("addUser")]
        public async Task<IActionResult> AddUser(UserModel inputModel)
        {
            int newId = _userRoleManager.addUser(inputModel);
            if(newId <= 0) { return BadRequest("Unable to create user"); }
            return Ok(newId);
        }

        //Update user basics (anything in the base user,
        //avoiding any other table updates)
        [HttpPost("userBasics")]
        public async Task<IActionResult> UpdateUserBasics(UserModel inputModel)
        {
            UserModel? updatedModel = _userRoleManager.updateUserBasics(inputModel);
            if (updatedModel == null) { return BadRequest("Failure to update user model"); }

            return Ok(updatedModel);
        }
        
        [HttpPost("userRoles")]
        public async Task<IActionResult> UpdateUserRoles(UserModel inputModel)
        {
            UserModel? updatedModel = _userRoleManager.updateUserRoles(inputModel);
            if (updatedModel == null) { return BadRequest("Failure to update user model"); }

            return Ok(updatedModel);
        }

        [HttpDelete("deleteUser")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_userRoleManager.deleteUser(id)) { return Ok(); }
            return BadRequest($"Unable to delete user with id {id}");
            
        }

        //----------------- Role Methods -----------------
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var retVal = _userRoleManager.getRoles();
            return Ok(retVal);
        }

        [HttpGet("role/{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            var retVal = _userRoleManager.getRole(id);
            if(retVal == null) { return BadRequest($"Unable to find role with id {id}"); }
            return Ok(retVal);
        }

        [HttpPost("addRole")]
        public async Task<IActionResult> AddRole(RoleModel inputModel)
        {
            int newId = _userRoleManager.addRole(inputModel);
            if (newId <= 0) { return BadRequest("Unable to create role"); }
            return Ok(newId);
        }

        [HttpPost("updateRole")]
        public async Task<IActionResult> UpdateRole(RoleModel inputModel)
        {
            var updatedModel = _userRoleManager.updateRole(inputModel);
            if (updatedModel == null) { return BadRequest("Failure to update user model"); }
            return Ok(updatedModel);
        }

        [HttpDelete("deleteRole")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            if (_userRoleManager.deleteRole(id)) { return Ok(); }
            return BadRequest($"Unable to delete role with id {id}");
        }

    }
}