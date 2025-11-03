using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MascotaSnacksAPI.Models
{
    public class Pedido
    {
        [Key]
        public int PedidoID { get; set; }

        public int ClienteID { get; set; }

        public DateTime FechaPedido { get; set; } = DateTime.UtcNow;

        [Required]
        [StringLength(50)]
        public string EstadoPedido { get; set; } = "Procesando";


        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalPedido { get; set; }

        [Required]
        [StringLength(500)]
        public string DireccionEnvio { get; set; } = string.Empty;

        // Propiedades de navegación
        [ForeignKey("ClienteID")]
        public Cliente Cliente { get; set; } = null!;
        public ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();

    }
}