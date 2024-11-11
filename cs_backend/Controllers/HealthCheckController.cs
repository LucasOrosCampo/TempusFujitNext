
using Microsoft.AspNetCore.Mvc;

namespace cs_backend.Controllers
{
    [ApiController]
    [Route("health")]
    public class HealthCheckController: ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get() => Ok("I am healthy"); 
    }
}
