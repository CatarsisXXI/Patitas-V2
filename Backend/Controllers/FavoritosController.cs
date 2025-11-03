using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.Models;
using System.Security.Claims;
using System.Linq;

namespace MascotaSnacksAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritosController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;

        public FavoritosController(MascotaSnacksContext context)
        {
            _context = context;
        }

        private int GetClienteId()
        {
            var clienteIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int.TryParse(clienteIdStr, out var clienteId);
            return clienteId;
        }

        // GET: api/Favoritos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetFavoritos()
        {
            var clienteId = GetClienteId();
            if (clienteId == 0) return Unauthorized();

            var favoritos = await _context.Favoritos
                .Where(f => f.ClienteID == clienteId)
                .Select(f => f.Producto)
                .ToListAsync();

            return Ok(favoritos);
        }

        // POST: api/Favoritos/5
        [HttpPost("{productoId}")]
        public async Task<IActionResult> AddFavorito(int productoId)
        {
            var clienteId = GetClienteId();
            if (clienteId == 0) return Unauthorized();

            var producto = await _context.Productos.FindAsync(productoId);
            if (producto == null) return NotFound("Producto no encontrado.");

            var yaExiste = await _context.Favoritos.AnyAsync(f => f.ClienteID == clienteId && f.ProductoID == productoId);
            if (yaExiste)
            {
                return Ok(new { message = "El producto ya está en tus favoritos." });
            }

            var favorito = new Favorito
            {
                ClienteID = clienteId,
                ProductoID = productoId
            };

            _context.Favoritos.Add(favorito);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFavoritos), new { id = favorito.FavoritoID }, new { message = "Producto añadido a favoritos." });
        }

        // DELETE: api/Favoritos/5
        [HttpDelete("{productoId}")]
        public async Task<IActionResult> RemoveFavorito(int productoId)
        {
            var clienteId = GetClienteId();
            if (clienteId == 0) return Unauthorized();

            var favorito = await _context.Favoritos.FirstOrDefaultAsync(f => f.ClienteID == clienteId && f.ProductoID == productoId);
            if (favorito == null)
            {
                return NotFound("El producto no se encuentra en tus favoritos.");
            }

            _context.Favoritos.Remove(favorito);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Producto eliminado de favoritos." });
        }
    }
}
