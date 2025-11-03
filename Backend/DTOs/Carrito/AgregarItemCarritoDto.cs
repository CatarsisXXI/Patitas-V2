using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.DTOs.Carrito
{
    public class AgregarItemCarritoDto
    {
        [Required]
        public int ProductoID { get; set; }

        [Required]
        [Range(1, 100)]
        public int Cantidad { get; set; }
    }
}