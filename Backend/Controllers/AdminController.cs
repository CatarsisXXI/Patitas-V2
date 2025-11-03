using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.DTOs.Admin;
using MascotaSnacksAPI.DTOs.Pedidos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MascotaSnacksAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;

        public AdminController(MascotaSnacksContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserForAdminDto>>> GetUsers()
        {
            var users = await _context.Clientes
                .OrderByDescending(c => c.FechaRegistro)
                .Select(c => new UserForAdminDto
                {
                    Id = c.ClienteID,
                    Nombre = c.Nombre,
                    Apellido = c.Apellido,
                    Email = c.Email,
                    FechaRegistro = c.FechaRegistro
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("pedidos")]
        public async Task<ActionResult<IEnumerable<PedidoAdminDto>>> GetPedidos()
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.Detalles)
                .ThenInclude(d => d.Producto)
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

        [HttpGet("estadisticas")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            var totalProductos = await _context.Productos.CountAsync(p => p.Activo);
            var totalPedidos = await _context.Pedidos.CountAsync();
            var totalUsuarios = await _context.Clientes.CountAsync();
            var ventasTotales = await _context.Pedidos
                                        .Where(p => p.EstadoPedido == "Entregado")
                                        .SumAsync(p => p.TotalPedido);

            var stats = new DashboardStatsDto
            {
                TotalProductos = totalProductos,
                TotalPedidos = totalPedidos,
                TotalUsuarios = totalUsuarios,
                VentasTotales = ventasTotales
            };

            return Ok(stats);
        }
    }
}
