using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.DTOs.Carrito
{
    public class UpdateItemCarritoDto
    {
        [Required]
        [Range(0, 100, ErrorMessage = "La cantidad debe estar entre 0 y 100.")]
        public int Cantidad { get; set; }
    }
}