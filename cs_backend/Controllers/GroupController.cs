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

        [HttpGet]
        [Route("{id}")]
        public async Task<GroupDto?> Get(string id)
        {
            if (!int.TryParse(id, out var parsedInt))
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return null;
            }
            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return null; 
            }
            return await groupService.Get(user, parsedInt);
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
        
        [HttpPost("delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            if (!int.TryParse(id, out var parsedInt)) return BadRequest();

            var user = UserHelper.GetUser(User);
            if (user == null) {
                HttpContext.Response.StatusCode = (int) HttpStatusCode.Unauthorized;
                return Forbid(); 
            }
            return (await groupService.Delete(user, parsedInt)) ? Ok() : BadRequest();
        }


    public record GroupRequest(string Name, string? Description);
 

    }
} 