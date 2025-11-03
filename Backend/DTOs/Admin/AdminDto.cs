using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.DTOs.Admin
{
    public class AdminDto
    {
        public int AdminID { get; set; }
        public string Usuario { get; set; } = string.Empty;
        public string NombreCompleto { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty;
    }

    public class CrearAdminDto
    {
        [Required]
        [StringLength(100)]
        public string Usuario { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string NombreCompleto { get; set; } = string.Empty;

        [Required]
        public string Rol { get; set; } = "Admin"; // "SuperAdmin", "Admin"
    }
}