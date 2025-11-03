using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MascotaSnacksAPI.Models
{
    public class Producto
    {
        [Key]
        public int ProductoID { get; set; }

        [Required]
        [StringLength(150)]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string Descripcion { get; set; } = string.Empty;


        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Precio { get; set; }

        [Required]
        public int Stock { get; set; }

        public int CategoriaID { get; set; }

        [StringLength(2048)]
        public string? ImagenURL { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        public bool Activo { get; set; } = true;

        // Propiedad de navegación para la relación con Categoria
        [ForeignKey("CategoriaID")]
        public Categoria Categoria { get; set; } = null!;
    }
}