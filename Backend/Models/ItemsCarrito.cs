using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MascotaSnacksAPI.Models
{
    public class ItemsCarrito
    {
        [Key]
        public int ItemID { get; set; }

        public int CarritoID { get; set; }
        public int ProductoID { get; set; }

        [Required]
        public int Cantidad { get; set; }

        // Propiedades de navegación
        [ForeignKey("CarritoID")]
        public Carrito Carrito { get; set; } = null!;

        [ForeignKey("ProductoID")]
        public Producto Producto { get; set; } = null!;

    }
}