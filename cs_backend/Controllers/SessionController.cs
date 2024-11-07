using cs_backend.Infrastructure;
using cs_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace cs_backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("session")]
    public class SessionController() : ControllerBase
    {
        [HttpPost("test")]
        public async Task<IActionResult> Test()
        {
            return Ok(); 
        }
    }
} 