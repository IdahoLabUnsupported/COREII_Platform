// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System.Configuration;
using System.Text;
using System.Text.Json.Serialization;
using CoreII.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using CoreII.Interfaces;
using CoreII.Business;
using CoreII.Business.Applications;
using CoreII.Business.DataUpload;
using CoreII.Data.SeedData;
using CoreII.Interfaces.Application;
using CoreII.Interfaces.DataUpload;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

var loggerFactory = LoggerFactory.Create(
            builder => builder
                        // add console as logging target
                        .AddConsole()
                        // add debug output as logging target
                        .AddDebug()
                        // set minimum level to log
                        .SetMinimumLevel(LogLevel.Debug)
        );

        
        var logger = loggerFactory.CreateLogger<Program>();
        
        logger.LogInformation("Info message");


var connectionString = builder.Configuration.GetConnectionString("Default");
string SQL_API_URL = Environment.GetEnvironmentVariable("SQL_API_URL");
string SQL_API_PORT = Environment.GetEnvironmentVariable("SQL_API_PORT");
string SQL_PASS = Environment.GetEnvironmentVariable("SQL_PASS");
string _jwtTokenKey = Environment.GetEnvironmentVariable("JWT_TOKEN_KEY");
if (_jwtTokenKey.IsNullOrEmpty())
{
    _jwtTokenKey = "TemporaryJWTKeyfortestinganddevelopmentpurposesUseEnvVariableToSetToProperKey";
}

string _connectionString =
    "Data Source=" + SQL_API_URL + "," + SQL_API_PORT +";Initial Catalog=PORTAL;User ID=sa;Password=" + SQL_PASS + ";TrustServerCertificate=True";
                        
                        
logger.LogInformation(_connectionString);
builder.Services.AddDbContext<PortalContext>(options => options.UseSqlServer(_connectionString));
//builder.Services.AddIdentity<IdentityUser, IdentityRole>()
//               .AddEntityFrameworkStores<PortalContext>()
//               .AddDefaultTokenProviders();
var secretKey = builder.Configuration.GetValue<string>("AppSettings:Key");



//builder.Services.Configure<IdentityOptions>(options =>
//{
//    // Default Password settings.
//    options.Password.RequireDigit = true;
//    options.Password.RequireLowercase = true;
//    options.Password.RequireNonAlphanumeric = true;
//    options.Password.RequireUppercase = true;
//    options.Password.RequiredLength = 13;
//    options.Password.RequiredUniqueChars = 1;
//});
//builder.Services.AddAuthentication(opt =>
//{
//    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//    opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

//}).AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false;
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidIssuer =builder.Configuration.GetSection("AppSettings:Issuer").Value,
//        ValidAudience = builder.Configuration.GetSection("AppSettings:Audience").Value,
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))

//    };

//}); ;



// Add services to the container.

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "portal.gov",
            ValidAudience = "portal.gov",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtTokenKey))
        };
    });

builder.Services.AddAuthorization();


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IUserRoleBusiness, UserRoleBusiness>();
builder.Services.AddTransient<IDataUploadBusiness, DataUploadBusiness>();
builder.Services.AddTransient<IApplicationBusiness, ApplicationBusiness>();

// Make sure CORS is added here before builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder =>
        {
            builder.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// This is where the service collection is finalized, so add services before this line
var app = builder.Build();
//seed data
SeedDatabase();

void SeedDatabase()
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<PortalContext>();
    Seeder.Initialize(context);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS with the specified policy
app.UseCors("CorsPolicy");
/*app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "Documents")),
    RequestPath = "/Documents"
});*/
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(app.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Uploads",
    DefaultContentType = "image/png"
    
});
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "Uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}
var documentsPath = Path.Combine(app.Environment.ContentRootPath, "Documents");
if (!Directory.Exists(documentsPath))
{
    Directory.CreateDirectory(documentsPath);
}

// Configure static file middleware for Uploads
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/Uploads"
});
// app.UseStaticFiles();    //Serve files from wwwroot
// app.UseStaticFiles(new StaticFileOptions
//  {
//      FileProvider = new PhysicalFileProvider(
//             Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
//      RequestPath = "/Uploads"
//  });
// Configure static file middleware for Documents
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(documentsPath),
    RequestPath = "/Documents"
});
app.MapControllers();
// app.MapStaticAssets();

app.Run();
