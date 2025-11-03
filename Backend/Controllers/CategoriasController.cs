using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.DTOs.Categorias;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace MascotaSnacksAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly ILogger<CategoriasController> _logger;

        public CategoriasController(MascotaSnacksContext context, ILogger<CategoriasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriaDto>>> GetCategorias()
        {
            _logger.LogInformation($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path}");

            var categorias = await _context.Categorias
                .Select(c => new CategoriaDto
                {
                    CategoriaID = c.CategoriaID,
                    Nombre = c.Nombre,
                    Descripcion = c.Descripcion
                })
                .ToListAsync();

            return Ok(categorias);
        }

        // GET: api/categorias/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaDto>> GetCategoria(int id)
        {
            _logger.LogInformation($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path}");

            var categoria = await _context.Categorias
                .Where(c => c.CategoriaID == id)
                .Select(c => new CategoriaDto
                {
                    CategoriaID = c.CategoriaID,
                    Nombre = c.Nombre,
                    Descripcion = c.Descripcion
                })
                .FirstOrDefaultAsync();

            if (categoria == null)
            {
                return NotFound();
            }

            return Ok(categoria);
        }
    }
}
