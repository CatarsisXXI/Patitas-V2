using System.Collections.Generic;

namespace MascotaSnacksAPI.DTOs.Carrito
{
    public class CarritoDto
    {
        public int CarritoID { get; set; }
        public int ClienteID { get; set; }
        public List<ItemCarritoDto> Items { get; set; } = new List<ItemCarritoDto>();
        public decimal Total { get; set; }
    }

    public class ItemCarritoDto
    {
        public int ProductoID { get; set; }
        public string NombreProducto { get; set; } = string.Empty;
        public decimal PrecioUnitario { get; set; }
        public int Cantidad { get; set; }
        public string? ImagenURL { get; set; }
    }
}