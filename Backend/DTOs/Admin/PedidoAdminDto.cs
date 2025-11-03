using MascotaSnacksAPI.DTOs.Pedidos;
using System.Collections.Generic;

namespace MascotaSnacksAPI.DTOs.Admin
{
    public class PedidoAdminDto
    {
        public int PedidoID { get; set; }
        public DateTime FechaPedido { get; set; }
        public string EstadoPedido { get; set; } = string.Empty;
        public decimal TotalPedido { get; set; }
        public string DireccionEnvio { get; set; } = string.Empty;
        public int ClienteID { get; set; }
        public string NombreCliente { get; set; } = string.Empty;
        public List<DetallePedidoDto> Detalles { get; set; } = new List<DetallePedidoDto>();
    }
}