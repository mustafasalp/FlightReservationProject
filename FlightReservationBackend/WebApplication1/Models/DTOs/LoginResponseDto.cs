namespace Backend.Models.DTOs
{
    public class LoginResponseDto
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
    }
}
