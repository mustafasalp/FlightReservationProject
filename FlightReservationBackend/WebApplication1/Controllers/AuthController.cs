// AuthController
using Backend.Models;
using Backend.Models.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        private readonly IEmailService _emailService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            RoleManager<IdentityRole<int>> roleManager,
            IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _roleManager = roleManager;
            _emailService = emailService;
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


        // POST: api/auth/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("User not found.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            
            // Encode token for URL
            var encodedToken = System.Net.WebUtility.UrlEncode(token);
            var resetLink = $"http://localhost:4200/reset-password?token={encodedToken}&email={dto.Email}";

            var body = $@"
                <h3>Password Reset Request</h3>
                <p>Click the link below to reset your password:</p>
                <a href='{resetLink}'>Reset Password</a>";

            await _emailService.SendEmailAsync(dto.Email, "Reset Password", body);

            return Ok(new { message = "Password reset link has been sent to your email." });
        }

        // POST: api/auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("Invalid request.");

            var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Password has been reset successfully." });
        }
        // GET: api/auth/test-email
        [HttpGet("test-email")]
        public async Task<IActionResult> TestEmail([FromQuery] string email)
        {
            try 
            {
                await _emailService.SendEmailAsync(email, "Test Email", "<h1>It Works!</h1><p>This is a test email from Flight App.</p>");
                return Ok(new { message = "Email sent successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Email failed", error = ex.Message, stack = ex.ToString() });
            }
        }
        // PUT: api/auth/update-profile
        [Authorize]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            // 1. Update basic info
            // Check if username/email is changing and if it is taken
            if (dto.UserName != user.UserName)
            {
                if (await _userManager.FindByNameAsync(dto.UserName) != null)
                    return BadRequest(new { message = "Username already taken." });
                user.UserName = dto.UserName;
            }

            if (dto.Email != user.Email)
            {
                if (await _userManager.FindByEmailAsync(dto.Email) != null)
                    return BadRequest(new { message = "Email already in use." });
                user.Email = dto.Email;
            }

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;

            // 2. Change password if provided
            bool passwordChanged = false;
            if (!string.IsNullOrEmpty(dto.CurrentPassword) && !string.IsNullOrEmpty(dto.NewPassword))
            {
                var passwordCheck = await _userManager.CheckPasswordAsync(user, dto.CurrentPassword);
                if (!passwordCheck)
                    return BadRequest(new { message = "Current password is incorrect." });

                var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
                if (!result.Succeeded)
                    return BadRequest(new { errors = result.Errors.Select(e => e.Description) });
                
                passwordChanged = true;
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return BadRequest(new { errors = updateResult.Errors.Select(e => e.Description) });

            return Ok(new 
            { 
                success = true, 
                requiresLogout = passwordChanged,
                message = passwordChanged ? "Profile updated. Please login again." : "Profile updated successfully.",
                user = new { 
                    user.FirstName, 
                    user.LastName, 
                    user.UserName, 
                    user.Email 
                }
            });
        }

        // GET: api/auth/profile
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            return Ok(new 
            { 
                user.FirstName, 
                user.LastName, 
                user.UserName, 
                user.Email 
            });
        }
    }
}
