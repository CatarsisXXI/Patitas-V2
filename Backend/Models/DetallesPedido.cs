using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MascotaSnacksAPI.Models
{
    public class DetallesPedido
    {
        [Key]
        public int DetalleID { get; set; }

        public int PedidoID { get; set; }

        public int ProductoID { get; set; }

        public int Cantidad { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal PrecioUnitario { get; set; } // Guardar el precio al momento de la compra

        // Propiedades de navegación
        [ForeignKey("PedidoID")]
        public Pedido Pedido { get; set; } = null!;

        [ForeignKey("ProductoID")]
        public Producto Producto { get; set; } = null!;
    }
}