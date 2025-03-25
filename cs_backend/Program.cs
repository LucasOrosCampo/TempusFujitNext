using cs_backend.Controllers.utils;
using cs_backend.Infrastructure;
using cs_backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.Production.json");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey =
            new SymmetricSecurityKey(Convert.FromBase64String(builder.Configuration["Jwt:Key"] ??
                                                              throw new Exception("Should be initialized")))
    };
});
builder.Services.AddAuthorization();
builder.Services.AddControllers()
    .AddJsonOptions(opt => opt.JsonSerializerOptions.Converters.Add(new DateTimeConverter()));

var clientUrl = builder.Configuration["ClientUrl"];

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDbContextFactory<MyDbContext>(options => options.UseSqlite($"Data Source={GetDbPath()}"));

builder.Services.AddTransient<UserService>();
builder.Services.AddTransient<GroupService>();
builder.Services.AddTransient<SessionService>();
builder.Services.AddTransient<JwtService>();


if (builder.Environment.IsDevelopment())
    builder.Services.AddSwaggerGen();

var app = builder.Build();
using var db = app.Services.GetService<IDbContextFactory<MyDbContext>>()?.CreateDbContext();
db?.Database.Migrate();

if (app.Environment.IsDevelopment())
{
    app.UseCors(opt => opt.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

string GetDbPath() =>
    OperatingSystem.IsWindows()
        ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "tempusfujit.db")
        : Path.Combine("/root", "tempusfujit.db");