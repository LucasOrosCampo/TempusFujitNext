using cs_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace cs_backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController(ILogger<UserController> logger, UserService userService, IHttpContextAccessor httpCtxAccessor) : ControllerBase
    {
        [HttpPost("login")]
        public async Task Login([FromBody] UserAuthenticationData loginUser)
        {
            if (! await userService.LogIn(loginUser)) httpCtxAccessor.HttpContext.Response.StatusCode = (int) HttpStatusCode.BadRequest;
            else
            {
                //httpCtxAccessor.HttpContext.Response.Headers.Authorization = Convert.ToBase64String()

            }
        }

        [HttpPost("register")]
        public async Task Register([FromBody] UserAuthenticationData registerUser)
        {
            
            var result =await userService.Register(registerUser);
            if (!result) httpCtxAccessor.HttpContext.Response.StatusCode = (int) HttpStatusCode.BadRequest;
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

} 