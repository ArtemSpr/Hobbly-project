using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private static List<User> Users = new();

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserDto request)
    {
        if (Users.Any(u => u.Email == request.Email))
            return BadRequest("Пользователь уже существует");

        var user = new User
        {
            Id = Users.Count + 1,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password)
        };

        Users.Add(user);
        return Ok("Регистрация успешна");
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserDto request)
    {
        var user = Users.SingleOrDefault(u => u.Email == request.Email);
        if (user == null) return BadRequest("Пользователь не найден");

        if (user.PasswordHash != HashPassword(request.Password))
            return BadRequest("Неверный пароль");

        var token = CreateToken(user);
        return Ok(new { token });
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, "User") // можно разные роли
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this_is_a_super_secret_key_1234567!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "MyApp",
            audience: "MyApp",
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}

public class UserDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}