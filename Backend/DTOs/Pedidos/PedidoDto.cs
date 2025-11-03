using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MascotaSnacksAPI.DTOs.Pedidos
{
    public class PedidoDto
    {
        public int PedidoID { get; set; }
        public DateTime FechaPedido { get; set; }
        public string EstadoPedido { get; set; } = string.Empty;
        public decimal TotalPedido { get; set; }
        public string DireccionEnvio { get; set; } = string.Empty;
        public List<DetallePedidoDto> Detalles { get; set; } = new List<DetallePedidoDto>();
    }

    public class DetallePedidoDto
    {
        public int ProductoID { get; set; }
        public string NombreProducto { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
    }

    public class CrearPedidoDto
    {
        [Required(ErrorMessage = "La dirección de envío es obligatoria.")]
        [StringLength(500, MinimumLength = 10, ErrorMessage = "La dirección de envío debe tener entre 10 y 500 caracteres.")]
        public string DireccionEnvio { get; set; } = string.Empty;

        [Required(ErrorMessage = "La información de pago es obligatoria.")]
        public MetodoPagoDto MetodoPago { get; set; } = new MetodoPagoDto();
    }

    public class MetodoPagoDto
    {
        [Required(ErrorMessage = "El número de la tarjeta es obligatorio.")]
        public string NumeroTarjeta { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre del titular es obligatorio.")]
        public string NombreTitular { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha de expiración es obligatoria.")]
        [RegularExpression(@"^\d{4}$", ErrorMessage = "La fecha de expiración debe tener el formato MMAA.")]
        public string FechaExpiracion { get; set; } = string.Empty;

        [Required(ErrorMessage = "El CVV es obligatorio.")]
        [StringLength(3, MinimumLength = 3, ErrorMessage = "El CVV debe tener 3 dígitos.")]
        public string Cvv { get; set; } = string.Empty;
    }

}