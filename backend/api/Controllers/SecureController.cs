using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SecureController : ControllerBase
{
    // доступ только авторизованным пользователям (любой токен)
    [HttpGet("profile")]
    [Authorize]
    public IActionResult GetProfile()
    {
        return Ok(new
        {
            message = "Это приватный профиль 😊",
            user = User.Identity?.Name
        });
    }

    // доступ только пользователям с ролью "Admin"
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAdminPanel()
    {
        return Ok("Добро пожаловать в админку 🔑");
    }
}