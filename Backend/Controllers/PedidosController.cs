using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.Models;
using MascotaSnacksAPI.DTOs.Pedidos;
using MascotaSnacksAPI.DTOs.Admin;
using System.Security.Claims;

using Microsoft.Extensions.Logging;

namespace MascotaSnacksAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly ILogger<PedidosController> _logger;

        public PedidosController(MascotaSnacksContext context, ILogger<PedidosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST: api/Pedidos
        [HttpPost]
        public async Task<IActionResult> CrearPedido([FromBody] CrearPedidoDto crearPedidoDto)
        {
            var clienteIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(clienteIdStr, out var clienteId))
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var carrito = await _context.Carritos
                .Include(c => c.Items)
                .ThenInclude(i => i.Producto)
                .FirstOrDefaultAsync(c => c.ClienteID == clienteId);

            if (carrito == null || !carrito.Items.Any())
            {
                return BadRequest("El carrito está vacío.");
            }

            // Simulación de validación de pago
            _logger.LogInformation("Procesando pago para el cliente {ClienteId} con tarjeta que termina en {LastFour}",
                clienteId, new string(crearPedidoDto.MetodoPago.NumeroTarjeta.TakeLast(4).ToArray()));

            if (!IsPaymentValid(crearPedidoDto.MetodoPago))
            {
                return BadRequest("La información de pago no es válida o fue rechazada.");
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var item in carrito.Items)
                {
                    if (item.Producto.Stock < item.Cantidad)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"No hay suficiente stock para el producto: {item.Producto.Nombre}. Disponible: {item.Producto.Stock}, Solicitado: {item.Cantidad}.");
                    }
                }

                var pedido = new Pedido
                {
                    ClienteID = clienteId,
                    FechaPedido = DateTime.UtcNow,
                    EstadoPedido = "Pagado",
                    DireccionEnvio = crearPedidoDto.DireccionEnvio,
                    TotalPedido = carrito.Items.Sum(i => i.Cantidad * i.Producto.Precio)
                };
                _context.Pedidos.Add(pedido);
                await _context.SaveChangesAsync();

                foreach (var item in carrito.Items)
                {
                    var detallePedido = new DetallePedido
                    {
                        PedidoID = pedido.PedidoID,
                        ProductoID = item.ProductoID,
                        Cantidad = item.Cantidad,
                        PrecioUnitario = item.Producto.Precio
                    };
                    _context.DetallesPedidos.Add(detallePedido);

                    var producto = item.Producto;
                    producto.Stock -= item.Cantidad;
                }

                _context.ItemsCarritos.RemoveRange(carrito.Items);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Pedido creado y pagado exitosamente!", pedidoId = pedido.PedidoID });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Ocurrió un error al crear el pedido.");
                return StatusCode(500, "Ocurrió un error interno al procesar el pedido.");
            }
        }

        private bool IsPaymentValid(MetodoPagoDto metodoPago)
        {
            // Lógica de simulación de pago
            // En un caso real, aquí se integraría con una pasarela de pago como Stripe, PayPal, etc.
            // Para esta simulación, cualquier tarjeta que no termine en "0000" es válida.
            return !metodoPago.NumeroTarjeta.EndsWith("0000");
        }

        // GET: api/Pedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoAdminDto>>> GetPedidos()
        {
            var clienteIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(clienteIdStr, out var clienteId))
            {
                return Unauthorized();
            }

            var pedidos = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.Detalles)
                .ThenInclude(d => d.Producto)
                .Where(p => p.ClienteID == clienteId)
                .OrderByDescending(p => p.FechaPedido)
                .Select(p => new PedidoAdminDto
                {
                    PedidoID = p.PedidoID,
                    FechaPedido = p.FechaPedido,
                    EstadoPedido = p.EstadoPedido,
                    TotalPedido = p.TotalPedido,
                    DireccionEnvio = p.DireccionEnvio,
                    ClienteID = p.ClienteID,
                    NombreCliente = p.Cliente.Nombre + " " + p.Cliente.Apellido,
                    Detalles = p.Detalles.Select(d => new DetallePedidoDto
                    {
                        ProductoID = d.ProductoID,
                        NombreProducto = d.Producto.Nombre,
                        Cantidad = d.Cantidad,
                        PrecioUnitario = d.PrecioUnitario
                    }).ToList()
                })
                .ToListAsync();

            return Ok(pedidos);
        }

        // GET: api/Pedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PedidoAdminDto>> GetPedido(int id)
        {
            var clienteIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(clienteIdStr, out var clienteId))
            {
                return Unauthorized();
            }

            var pedido = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.Detalles)
                .ThenInclude(d => d.Producto)
                .Where(p => p.PedidoID == id)
                .Select(p => new PedidoAdminDto // Reusing DTO for simplicity
                {
                    PedidoID = p.PedidoID,
                    FechaPedido = p.FechaPedido,
                    EstadoPedido = p.EstadoPedido,
                    TotalPedido = p.TotalPedido,
                    DireccionEnvio = p.DireccionEnvio,
                    ClienteID = p.ClienteID,
                    NombreCliente = p.Cliente.Nombre + " " + p.Cliente.Apellido,
                    Detalles = p.Detalles.Select(d => new DetallePedidoDto
                    {
                        ProductoID = d.ProductoID,
                        NombreProducto = d.Producto.Nombre,
                        Cantidad = d.Cantidad,
                        PrecioUnitario = d.PrecioUnitario
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (pedido == null)
            {
                return NotFound("Pedido no encontrado.");
            }

            // Security check: ensure the user is fetching their own order
            if (pedido.ClienteID != clienteId)
            {
                return Forbid("No tienes permiso para ver este pedido.");
            }

            return Ok(pedido);
        }
    }
}
