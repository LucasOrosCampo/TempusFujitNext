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
        public async Task<SessionDto[]> Get([FromQuery] string groupName)
        {
            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return []; 
            }
            return await sessionService.GetAll(user, groupName);
        }
    }
} 