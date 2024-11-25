using cs_backend.Controllers.utils;
using cs_backend.Infrastructure.ViewModels;
using cs_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace cs_backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("session")]
    public class SessionController(SessionService sessionService) : ControllerBase
    {
        [HttpGet]
        public async Task<SessionDto[]> Get([FromQuery] string group, [FromQuery] DateTime? start, [FromQuery] DateTime? end)
        {
            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return []; 
            }
            return await sessionService.Search(user, group, start, end);
        }

        public record StartSession(DateTime Start, int Group);
        [HttpPost("start")]
        public async Task<IActionResult> Start([FromBody] StartSession startSession)
        {
            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return Forbid(); 
            }
            return (await sessionService.Start(user, startSession)) ? Ok() : BadRequest();
        }

        public record EndSession(DateTime Start, DateTime End, int Group); 
        [HttpPost("end")]
        public async Task<IActionResult> End([FromBody] EndSession endSession)
        {
            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return Forbid(); 
            }
            return (await sessionService.End(user, endSession)) ? Ok() : BadRequest();
        }
        [HttpGet("duration")]
        public async Task<double> GetDuration([FromQuery] string group, [FromQuery] DateTime? start,[FromQuery] DateTime? end)
        {
            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return 0; 
            }
            return await sessionService.GetDuration(user, group, start, end);
        }


    }
} 