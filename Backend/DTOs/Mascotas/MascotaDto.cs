using System;
using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.DTOs.Mascotas
{
    public class MascotaDto
    {
        public int MascotaID { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Especie { get; set; } = string.Empty;
        public string? Sexo { get; set; }
        public string? Raza { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string? Tamaño { get; set; }
        public string? NotasAdicionales { get; set; }
        public string? Avatar { get; set; }
    }

    public class CrearMascotaDto
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Especie { get; set; } = string.Empty; // "Perro", "Gato"

        [StringLength(20)]
        public string? Sexo { get; set; } // "Hembra", "Macho"

        [StringLength(100)]
        public string? Raza { get; set; }

        public DateTime? FechaNacimiento { get; set; }

        [StringLength(50)]
        public string? Tamaño { get; set; } // "Pequeño", "Mediano", "Grande"

        public string? NotasAdicionales { get; set; }

        [StringLength(255)]
        public string? Avatar { get; set; }
    }
}