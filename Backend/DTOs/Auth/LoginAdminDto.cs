using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.DTOs.Auth
{
    public class LoginAdminDto
    {
        [Required]
        public string Usuario { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}