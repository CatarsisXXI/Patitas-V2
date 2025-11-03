using System;
using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.Models
{
    public class Administrador
    {
        [Key]
        public int AdminID { get; set; }

        [Required]
        [StringLength(100)]
        public string Usuario { get; set; } = string.Empty;

        [Required]
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

        [Required]
        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

        [Required]
        [StringLength(200)]
        public string NombreCompleto { get; set; } = string.Empty;


        [Required]
        [StringLength(50)]
        public string Rol { get; set; } = "Admin";

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}