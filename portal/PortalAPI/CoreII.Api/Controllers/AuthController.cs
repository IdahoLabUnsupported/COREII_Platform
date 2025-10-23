// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Collections.Generic;
using System.Data;
using System.DirectoryServices.Protocols;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
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
using Microsoft.Extensions.Logging;


// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreIIApi.Controllers
{
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    [Route("api/auth")]
    [ApiController]
    public class AuthController : Controller
    {
        private PortalContext dc;
        private IConfiguration configuration;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<AuthController> _logger;


        public AuthController(PortalContext dc, IConfiguration configuration, ILogger<AuthController> logger)
        {
            
            this.dc = dc;
            this.configuration = configuration;
            this._logger = logger;

            //_userManager = userManager;
            //_roleManager = roleManager;
        }

        private readonly string _ldapServer = Environment.GetEnvironmentVariable("LDAP_SERVER");
        private readonly string _msaAccount = Environment.GetEnvironmentVariable("MSA_ACCOUNT");
        private readonly string _msaPassword = Environment.GetEnvironmentVariable("MSA_PASSWORD");
        private readonly string _searchDn = Environment.GetEnvironmentVariable("SEARCH_DN");
        private readonly string _jwtTokenKey = Environment.GetEnvironmentVariable("JWT_TOKEN_KEY");

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            //Testing, if no ldap set, assume local env
            if(_ldapServer == null)
            {
                var token = GenerateJwtToken(request.Username);
                return Ok(new { token });
            }

            if (_ldapServer == null)
            {
                return BadRequest(new { message = "ldapserver  env variable is null" });
            }
            if (_msaAccount == null)
            {
                return BadRequest(new { message = "msaAccount env variable is null" });
            }
            if (_msaPassword == null)
            {
                return BadRequest(new { message = "msaPAssword env variable is null" });
            }
            if (AuthenticateUser(request.Username, request.Password))
            {
                var token = GenerateJwtToken(request.Username);
                return Ok(new { token });
            } else
            {
                return Unauthorized(new { message = "User Not recognized" });
            }
            string unAuthMessage = $"server: {_ldapServer} - account : {_msaAccount.Substring(0, 4)}*****{_msaAccount.Substring(_msaAccount.Length - 2, 2)} - password : {_msaPassword.Substring(0, 4)}*****{_msaPassword.Substring(_msaPassword.Length - 2, 2)}";
            return Unauthorized(new { message = unAuthMessage });
        }
        private string GenerateJwtToken(string username)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };
            var _jwtKey = "TemporaryJWTKeyfortestinganddevelopmentpurposesUseEnvVariableToSetToProperKey";
            if(_jwtTokenKey != null) {
                _jwtKey = _jwtTokenKey;
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "portal.gov",
                audience: "portal.gov",
                claims: claims,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool AuthenticateUser(string username, string password)
        {
            _logger.LogInformation("Starting authentication for user: {Username}", username);

            try
            {
                // First, bind to LDAP with a service account to search for the user
                LdapDirectoryIdentifier identifier = new LdapDirectoryIdentifier(_ldapServer);
                _logger.LogDebug("LDAP Directory Identifier created for server: {LdapServer}", _ldapServer);
            
                // Connect using the MSA password for the initial search connection
                NetworkCredential searchCredential = new NetworkCredential(_msaAccount, _msaPassword);
                _logger.LogDebug("Using service account {ServiceAccount} for initial bind.", _msaAccount);

                using (LdapConnection searchConnection = new LdapConnection(identifier, searchCredential, AuthType.Basic))
                {
                    searchConnection.Bind();
                    _logger.LogDebug("Successfully bound to LDAP server using service account.");
                
                    // Search for the user by sAMAccountName
                    _logger.LogDebug("Sending search request for sAMAccountName: {Username}", username);
                    SearchRequest searchRequest = new SearchRequest(
                        _searchDn,
                        $"(sAMAccountName={username})",
                        System.DirectoryServices.Protocols.SearchScope.Subtree,
                        new string[] { "distinguishedName" }
                    );
                
                    SearchResponse searchResponse = (SearchResponse)searchConnection.SendRequest(searchRequest);
                
                    if (searchResponse.Entries.Count == 0)
                    {
                        _logger.LogWarning("User {Username} not found in LDAP.", username);
                        return false; // User not found
                    }
                
                    // Get the user's DN from the search result
                    string userDn = searchResponse.Entries[0].DistinguishedName;
                    _logger.LogInformation("User {Username} found in LDAP with distinguished name: {UserDn}", username, userDn);
                
                    // Now authenticate with the found DN and provided password
                    NetworkCredential credential = new NetworkCredential(userDn, password);
                    using (LdapConnection authConnection = new LdapConnection(identifier, credential, AuthType.Basic))
                    {
                        authConnection.Bind(); // This will throw an exception if authentication fails
                        _logger.LogInformation("Authentication successful for user: {Username}", username);
                        return true;
                    }
                }
            }
            catch (LdapException ex)
            {
                _logger.LogError(ex, "LDAP error occurred during authentication for user: {Username}", username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error during authentication for user: {Username}", username);
            }

            _logger.LogWarning("Authentication failed for user: {Username}", username);
            return false;
        }


        //[HttpPost("login")]
        //public async Task<IActionResult> Login(LoginReqDto loginReq)
        //{

        //    var user = await _userManager.FindByNameAsync(loginReq.UserName);
        //    if (user != null && await _userManager.CheckPasswordAsync(user, loginReq.Password))
        //    {
        //        var loginRes = new LoginResDto();
        //        loginRes.UserName = user.UserName;
        //        loginRes.Token = CreateJWT(user);
        //        return Ok(loginRes);

        //    }
        //    return Unauthorized();

        //}


        ////[Authorize(Roles = "Admin")]
        //[HttpPost]
        //[Route("register")]
        //public async Task<IActionResult> RegisterAdmin([FromBody] LoginReqDto model)
        //{
        //    var userExists = await _userManager.FindByNameAsync(model.UserName);

        //    Tuple<bool, List<PasswordError>> tmpItem = checkPasswordCompliance(model.Password);
        //    if (!tmpItem.Item1)
        //    {
        //        return StatusCode(StatusCodes.Status403Forbidden);
        //    }

        //    if (userExists != null)
        //        return StatusCode(StatusCodes.Status500InternalServerError, "User already exists!");

        //    ApplicationUser user = new()
        //    {
        //        Email = model.UserName,
        //        SecurityStamp = Guid.NewGuid().ToString(),
        //        UserName = model.UserName,
        //        LastPasswordChangedDate = DateTime.UtcNow,
        //        mustChangePassword = true
        //    };
        //    var result = await _userManager.CreateAsync(user, model.Password);
        //    if (!result.Succeeded)
        //        return StatusCode(StatusCodes.Status500InternalServerError, "User creation failed! Please check user details and try again.");

        //    if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
        //        await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        //    if (!await _roleManager.RoleExistsAsync(UserRoles.User))
        //        await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));

        //    if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
        //    {
        //        await _userManager.AddToRoleAsync(user, UserRoles.Admin);
        //    }
        //    if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
        //    {
        //        await _userManager.AddToRoleAsync(user, UserRoles.User);
        //    }
        //    return Ok();
        //}
        //private Tuple<bool, List<PasswordError>> checkPasswordCompliance(string plainTextPassword)
        //{
        //    List<PasswordError> rules = new List<PasswordError>
        //    {
        //        //new PasswordError() { Passed = false, Error = "Must contain at least two (2) digits", RegEx = new Regex("(?=(.*[0-9].*){2})") },
        //        //new PasswordError() { Passed = false, Error = "Must contain at least one (1) uppercase letter", RegEx = new Regex("(?=.*[A-Z])") },
        //        //new PasswordError() { Passed = false, Error = "Must contain at least one (1) lowercase letter", RegEx = new Regex("(?=.*[a-z])") },
        //        //new PasswordError() { Passed = false, Error = "Must contain at least one (1) special character", RegEx = new Regex("(?=.*[$@^!%*?&])") },
        //        //new PasswordError() { Passed = false, Error = "Must be at least 25 characters long", RegEx = new Regex("^.{25,}$") }
        //    };

        //    bool passesAllRules = true;
        //    foreach (PasswordError passwordError in rules)
        //    {
        //        passwordError.Passed = passwordError.RegEx.IsMatch(plainTextPassword);
        //        passesAllRules = passesAllRules && passwordError.Passed;
        //    }
        //    return new Tuple<bool, List<PasswordError>>(passesAllRules, rules);
        //}

        private string CreateJWT(IdentityUser user)
        {

            var secretKey = configuration.GetSection("AppSettings:Key").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(secretKey));
            var userRoles = _userManager.GetRolesAsync(user).Result;

            var claims = new List<Claim> {
                new Claim("name",user.UserName),
                new Claim("nameidentifier",user.Id.ToString())
            };

            var signingCredentials = new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256Signature);

            foreach (var userRole in userRoles)
            {
                claims.Add(new Claim("role", userRole));
            }

            var tokenDescriptor = new JwtSecurityToken(

                configuration.GetSection("AppSettings:Issuer").Value,
                configuration.GetSection("AppSettings:Audience").Value,
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.AddMinutes(30),
                signingCredentials
            );


            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenDescriptor);
            return token;
        }

    }
}

