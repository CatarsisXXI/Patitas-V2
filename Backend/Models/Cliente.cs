using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.Models
{
    public class Cliente
    {
        [Key]
        public int ClienteID { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Apellido { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

        [Required]
        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();


        [StringLength(500)]
        public string? DireccionEnvio { get; set; }

        [StringLength(20)]
        public string? Telefono { get; set; }

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;


        // Propiedades de navegación
        public ICollection<Mascota> Mascotas { get; set; } = new List<Mascota>();
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public ICollection<Favorito> Favoritos { get; set; } = new List<Favorito>();

        public Carrito? Carrito { get; set; }
    }
}