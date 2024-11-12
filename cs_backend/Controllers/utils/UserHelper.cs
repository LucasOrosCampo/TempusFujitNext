using System.Security.Claims;

namespace cs_backend.Controllers.utils
{
    public static class UserHelper
    {
        public static string? GetUser(ClaimsPrincipal user) => user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? user.FindFirst("sub")?.Value;
    }
}
