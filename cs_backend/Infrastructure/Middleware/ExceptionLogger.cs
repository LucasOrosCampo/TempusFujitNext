using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace cs_backend.Infrastructure.Middleware;

public class ExceptionLoggerMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionLoggerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, ILogger<ExceptionLoggerMiddleware> logger)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            using var reader = new StreamReader(context.Request.Body);
            var strBody = await reader.ReadToEndAsync();
            var jsonQuery = JsonSerializer.Serialize(context.Request.QueryString);
            var log = $"Request on route {context.Request.Path} with query {jsonQuery} and body {strBody} " +
                         $"failed with exception {ex.Message}";
            logger.LogError(log);
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            throw;
        }
    }
    
}