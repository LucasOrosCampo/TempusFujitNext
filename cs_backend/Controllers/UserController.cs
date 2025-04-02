using cs_backend.Infrastructure;
using cs_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace cs_backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController(ILogger<UserController> logger, UserService userService, IHttpContextAccessor httpCtxAccessor, JwtService jwt) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserAuthenticationData loginUser)
        {
            if (! await userService.LogIn(loginUser)) return BadRequest();
            else  return Ok(jwt.GenerateJwtToken(loginUser.UserName)); 
        } 

        [HttpPost("register")]
        public async Task Register([FromBody] UserAuthenticationData registerUser)
        {
            
            var result =await userService.Register(registerUser);
            if (!result) httpCtxAccessor.HttpContext.Response.StatusCode = (int) HttpStatusCode.BadRequest;
        }

        [Authorize]
        [HttpGet("validate/token")]
        public async Task<bool> ValidateToken() => true;

        [HttpGet("validate/other")]
        public async Task<bool> other()
        {
            throw new NotImplementedException();
        }
    }

    public record UserAuthenticationData
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        
        public bool IsValid()
        {
            return !string.IsNullOrEmpty(UserName) &&  !string.IsNullOrEmpty(Password); 
        }
    }

    public record UserInformation
    {
        public string UserName { get; set; } = string.Empty;
    }

} 