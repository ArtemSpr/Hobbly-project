using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SecureController : ControllerBase
{
    [HttpGet("profile")]
    [Authorize]
    public IActionResult GetProfile()
    {
        return Ok(new
        {
            message = "Private only",
            user = User.Identity?.Name
        });
    }

    // only with "Admin" role
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAdminPanel()
    {
        return Ok("Welcome admin");
    }
}