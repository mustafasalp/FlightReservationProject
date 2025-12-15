// AuthController
using Backend.Models;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly RoleManager<IdentityRole<int>> _roleManager;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            RoleManager<IdentityRole<int>> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _roleManager = roleManager;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Email / username dolu mu kontrol et
            if (await _userManager.FindByNameAsync(dto.UserName) != null)
                return BadRequest(new { message = "Username already taken." });

            if (await _userManager.FindByEmailAsync(dto.Email) != null)
                return BadRequest(new { message = "Email already in use." });

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

            // Role tablosunda "User" yoksa oluştur
            if (!await _roleManager.RoleExistsAsync("User"))
                await _roleManager.CreateAsync(new IdentityRole<int>("User"));

            await _userManager.AddToRoleAsync(user, "User");

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            return Ok(new
            {
                success = true,
                token,
                userId = user.Id,
                firstName = user.FirstName,
                role = roles.FirstOrDefault() ?? "User"
            });
        }

        // POST: api/auth/login
        // POST: api/auth/login
        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            ApplicationUser? user =
                await _userManager.FindByNameAsync(dto.UserNameOrEmail)
                ?? await _userManager.FindByEmailAsync(dto.UserNameOrEmail);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password." });

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);

            if (!signInResult.Succeeded)
                return Unauthorized(new { message = "Invalid username or password." });

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            var response = new LoginResponseDto
            {
                Success = true,
                Token = token,
                UserId = user.Id,
                FirstName = user.FirstName,
                Role = roles.FirstOrDefault() ?? "User"
            };

            return Ok(response);
        }

    }
}
