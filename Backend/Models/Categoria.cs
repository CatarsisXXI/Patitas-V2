using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace MascotaSnacksAPI.Models
{
    public class Categoria
    {
        [Key]
        public int CategoriaID { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(255)]
        public string? Descripcion { get; set; }

        // Propiedad de navegación para la relación con Productos
        public ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }
}