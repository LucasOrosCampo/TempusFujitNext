using cs_backend.Infrastructure;
using cs_backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContextFactory<MyDbContext>( options => options.UseSqlite($"Data Source={Path.GetFullPath("tempusfujit.db")}"));

Console.WriteLine($"++++++++++++++-------------{builder.Environment.IsProduction()}");
Console.WriteLine($"++++++++++++++-------------{builder.Environment.EnvironmentName}");
builder.Configuration.AddJsonFile("appsettings.Production.json");
var jwtConf = builder.Configuration.GetSection("JwtSettings");
Console.WriteLine($"-------------++++++++++++++++++{builder.Configuration["JwtSettings:SecretKey"]}");

builder.Services.AddTransient<UserService>();

var app = builder.Build();

using var db = app.Services.GetService<IDbContextFactory<MyDbContext>>().CreateDbContext();
db.Database.Migrate();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
