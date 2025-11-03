using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MascotaSnacksAPI.Models
{
    public class Carrito
    {
        [Key]
        public int CarritoID { get; set; }

        public int ClienteID { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        // Propiedades de navegación
        [ForeignKey("ClienteID")]
        public Cliente Cliente { get; set; } = null!;
        public ICollection<ItemsCarrito> Items { get; set; } = new List<ItemsCarrito>();

    }
}