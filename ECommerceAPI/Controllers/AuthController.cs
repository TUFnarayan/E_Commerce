using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ECommerceAPI.Models;
using ECommerceAPI.Services;
using System.Linq;
using System.Collections.Generic;
using ECommerceAPI.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace ECommerceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IJwtService jwtService, AppDbContext db, IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
            _db = db;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = new ApplicationUser { UserName = dto.UserName, Email = dto.Email };
            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors.Select(e => e.Description));

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtService.GenerateToken(user, roles);

            // create a refresh token and persist it
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString("N") + Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                UserId = user.Id,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(30)
            };
            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            // set HttpOnly cookie
            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = refreshToken.Expires
            });

            return Ok(new { token = accessToken });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.UserName);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var valid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!valid)
                return Unauthorized("Invalid credentials");

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtService.GenerateToken(user, roles);

            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString("N") + Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                UserId = user.Id,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(30)
            };
            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = refreshToken.Expires
            });

            return Ok(new { token = accessToken });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var token))
                return Unauthorized();

            var stored = _db.RefreshTokens.SingleOrDefault(r => r.Token == token);
            if (stored == null || !stored.IsActive)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(stored.UserId);
            if (user == null) return Unauthorized();

            // revoke the old token and issue a new one (rotation)
            stored.Revoked = DateTime.UtcNow;

            var newRefresh = new RefreshToken
            {
                Token = Guid.NewGuid().ToString("N") + Convert.ToBase64String(Guid.NewGuid().ToByteArray()),
                UserId = user.Id,
                Created = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddDays(30)
            };
            _db.RefreshTokens.Add(newRefresh);
            await _db.SaveChangesAsync();

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtService.GenerateToken(user, roles);

            Response.Cookies.Append("refreshToken", newRefresh.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = newRefresh.Expires
            });

            return Ok(new { token = accessToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            if (Request.Cookies.TryGetValue("refreshToken", out var token))
            {
                var stored = _db.RefreshTokens.SingleOrDefault(r => r.Token == token);
                if (stored != null)
                {
                    stored.Revoked = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                }
            }

            Response.Cookies.Delete("refreshToken");
            return Ok();
        }

        public record RegisterDto(string UserName, string Email, string Password);
        public record LoginDto(string UserName, string Password);
    }
}
