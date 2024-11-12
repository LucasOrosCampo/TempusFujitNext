using cs_backend.Controllers.utils;
using cs_backend.Infrastructure.ViewModels;
using cs_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace cs_backend.Controllers
{
    [Controller]
    [Authorize]
    [Route("group")]
    public class GroupController(GroupService groupService): ControllerBase
    {
        [HttpGet]
        public async Task<GroupDto[]> Get()
        {
            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return []; 
            }
            return await groupService.GetAll(user);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] GroupRequest createGroup)
        {
            var user = UserHelper.GetUser(User);
            if (user == null) return Unauthorized(); 
            
            var result = await groupService.CreateGroup(createGroup, user); 
        
           if (result) return Ok();

            return BadRequest();
        }

    public record GroupRequest(string Name, string? Description);
 

    }
} 