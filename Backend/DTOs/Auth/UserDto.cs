namespace MascotaSnacksAPI.DTOs.Auth
{
    public class UserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
    }
}