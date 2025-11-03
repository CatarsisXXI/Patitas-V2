using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.DTOs.Categorias
{
    public class CrearCategoriaDto
    {
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Descripcion { get; set; }
    }
}