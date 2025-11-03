using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MascotaSnacksAPI.Models
{
    public class Favorito
    {
        [Key]
        public int FavoritoID { get; set; }

        public int ClienteID { get; set; }
        public int ProductoID { get; set; }

        // Propiedades de navegación
        [ForeignKey("ClienteID")]
        public Cliente Cliente { get; set; } = null!;

        [ForeignKey("ProductoID")]
        public Producto Producto { get; set; } = null!;

    }
}