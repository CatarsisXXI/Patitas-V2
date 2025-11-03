using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace MascotaSnacksAPI.DTOs.Productos
{
    public class CrearProductoDto
    {

        [Required]
        [StringLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 10000)]
        public decimal Precio { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [Required]
        public int CategoriaID { get; set; }

        public IFormFile? ImagenFile { get; set; }

        public string? ImagenURL { get; set; }

        [Required]

        public bool Activo { get; set; } = true;
    }
}