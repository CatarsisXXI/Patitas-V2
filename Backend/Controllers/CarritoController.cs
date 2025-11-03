using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.Models;
using MascotaSnacksAPI.DTOs.Carrito;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace MascotaSnacksAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Requiere autenticación para todo el controlador
    public class CarritoController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly ILogger<CarritoController> _logger;

        public CarritoController(MascotaSnacksContext context, ILogger<CarritoController> logger)
        {
            _context = context;
            _logger = logger;
        }


        private int GetClienteId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/Carrito
        [HttpGet]
        public async Task<ActionResult<CarritoDto>> GetCarrito()
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            var carrito = await _context.Carritos
                .Include(c => c.Items)
                .ThenInclude(i => i.Producto)
                .FirstOrDefaultAsync(c => c.ClienteID == clienteId);

            if (carrito == null)
            {
                // Si no existe, creamos uno nuevo para el cliente
                carrito = new Carrito { ClienteID = clienteId };
                _context.Carritos.Add(carrito);
                await _context.SaveChangesAsync();
            }

            var carritoDto = new CarritoDto
            {
                CarritoID = carrito.CarritoID,
                ClienteID = carrito.ClienteID,
                Items = carrito.Items.Select(i => new ItemCarritoDto
                {
                    ProductoID = i.ProductoID,
                    NombreProducto = i.Producto.Nombre,
                    PrecioUnitario = i.Producto.Precio,
                    Cantidad = i.Cantidad,
                    ImagenURL = i.Producto.ImagenURL
                }).ToList(),
                Total = carrito.Items.Sum(i => i.Cantidad * i.Producto.Precio)
            };

            return Ok(carritoDto);
        }

        // POST: api/Carrito/items
        [HttpPost("items")]
        public async Task<ActionResult<CarritoDto>> AddItemAlCarrito(AgregarItemCarritoDto itemDto)
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var carrito = await _context.Carritos
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.ClienteID == clienteId);

            if (carrito == null)
            {
                carrito = new Carrito { ClienteID = clienteId };
                _context.Carritos.Add(carrito);
                await _context.SaveChangesAsync();
            }

            var producto = await _context.Productos.FindAsync(itemDto.ProductoID);
            if (producto == null || !producto.Activo)
            {
                return BadRequest("El producto no existe o no está disponible.");
            }

            if (producto.Stock < itemDto.Cantidad)
            {
                return BadRequest("No hay suficiente stock para la cantidad solicitada.");
            }

            var itemExistente = carrito.Items.FirstOrDefault(i => i.ProductoID == itemDto.ProductoID);
            if (itemExistente != null)
            {
                itemExistente.Cantidad += itemDto.Cantidad;
            }
            else
            {
                var nuevoItem = new ItemsCarrito
                {
                    CarritoID = carrito.CarritoID,
                    ProductoID = itemDto.ProductoID,
                    Cantidad = itemDto.Cantidad
                };
                _context.ItemsCarritos.Add(nuevoItem);
            }

            await _context.SaveChangesAsync();

            return await GetCarrito();
        }

        // PUT: api/Carrito/items/5
        [HttpPut("items/{productoId}")]
        public async Task<ActionResult<CarritoDto>> UpdateItemCantidad(int productoId, [FromBody] int cantidad)
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            if (cantidad <= 0)
            {
                return BadRequest("La cantidad debe ser mayor a 0.");
            }

            var carrito = await _context.Carritos
                .Include(c => c.Items)
                .ThenInclude(i => i.Producto)
                .FirstOrDefaultAsync(c => c.ClienteID == clienteId);

            if (carrito == null)
            {
                return NotFound("No se encontró el carrito.");
            }

            var item = carrito.Items.FirstOrDefault(i => i.ProductoID == productoId);
            if (item == null)
            {
                return NotFound("El producto no se encuentra en el carrito.");
            }

            if (item.Producto.Stock < cantidad)
            {
                return BadRequest("No hay suficiente stock para la cantidad solicitada.");
            }

            item.Cantidad = cantidad;
            await _context.SaveChangesAsync();

            return await GetCarrito();
        }

        // DELETE: api/Carrito/items/5
        [HttpDelete("items/{productoId}")]
        public async Task<ActionResult<CarritoDto>> RemoveItemDelCarrito(int productoId)
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            var carrito = await _context.Carritos
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.ClienteID == clienteId);

            if (carrito == null)
            {
                return NotFound("No se encontró el carrito.");
            }

            var item = carrito.Items.FirstOrDefault(i => i.ProductoID == productoId);
            if (item == null)
            {
                return NotFound("El producto no se encuentra en el carrito.");
            }

            _context.ItemsCarritos.Remove(item);
            await _context.SaveChangesAsync();

            return await GetCarrito();
        }

        // DELETE: api/Carrito
        [HttpDelete]
        public async Task<IActionResult> VaciarCarrito()
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            var carrito = await _context.Carritos
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.ClienteID == clienteId);

            if (carrito != null)
            {
                _context.ItemsCarritos.RemoveRange(carrito.Items);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }
    }
}
