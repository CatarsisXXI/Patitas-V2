using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.DTOs.Productos;
using MascotaSnacksAPI.Models;
using MascotaSnacksAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System;
using System.Security.Claims;

namespace MascotaSnacksAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly ILogger<ProductosController> _logger;
        private readonly IWebHostEnvironment _env;
        private readonly AdminActivityService _activityService;

        public ProductosController(MascotaSnacksContext context, ILogger<ProductosController> logger, IWebHostEnvironment env, AdminActivityService activityService)
        {
            _context = context;
            _logger = logger;
            _env = env;
            _activityService = activityService;
        }

        private string GetAdminName()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value ?? "Admin";
        }

        // GET: api/productos/categorias
        [HttpGet("categorias")]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            _logger.LogInformation($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path}");

            var categorias = await _context.Categorias.OrderBy(c => c.Nombre).ToListAsync();

            return Ok(categorias);
        }

        // GET: api/productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductos([FromQuery] string? searchTerm, [FromQuery] int? categoriaId, [FromQuery] bool includeInactive = false)
        {
            _logger.LogInformation($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path}");

            var query = _context.Productos.AsQueryable();

            // For admin requests, we might want to see inactive products
            if (!includeInactive)
            {
                query = query.Where(p => p.Activo);
            }

            if (categoriaId.HasValue)
            {

                query = query.Where(p => p.CategoriaID == categoriaId.Value);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => p.Nombre.Contains(searchTerm) || p.Descripcion.Contains(searchTerm));
            }

            var productos = await query
                .Include(p => p.Categoria)
                .Select(p => new ProductoDto
                {
                    ProductoID = p.ProductoID,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    Precio = p.Precio,
                    Stock = p.Stock,
                    CategoriaNombre = p.Categoria.Nombre,
                    ImagenURL = p.ImagenURL,
                    Activo = p.Activo
                })
                .ToListAsync();

            return Ok(productos);
        }

        // GET: api/productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProducto(int id)
        {
            _logger.LogInformation($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path}");

            var producto = await _context.Productos
                .Where(p => p.ProductoID == id) // Get product regardless of active status for detail view
                .Include(p => p.Categoria)
                .Select(p => new ProductoDto
                {
                    ProductoID = p.ProductoID,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    Precio = p.Precio,
                    Stock = p.Stock,
                    CategoriaNombre = p.Categoria.Nombre,
                    ImagenURL = p.ImagenURL,
                    Activo = p.Activo
                })
                .FirstOrDefaultAsync();

            if (producto == null)
            {
                return NotFound();
            }

            return Ok(producto);
        }

        // POST: api/productos
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductoDto>> CreateProducto([FromForm] CrearProductoDto productoDto)
        {
            _logger.LogInformation($"Request to create product: {productoDto.Nombre}");

            if (!ModelState.IsValid)
            {
                 return BadRequest(ModelState);
            }

            // Validate that either image file or image URL is provided
            if ((productoDto.ImagenFile == null || productoDto.ImagenFile.Length == 0) && string.IsNullOrEmpty(productoDto.ImagenURL))
            {
                return BadRequest("Debe proporcionar un archivo de imagen o una URL de imagen.");
            }

            var categoria = await _context.Categorias.FindAsync(productoDto.CategoriaID);
            if (categoria == null)
            {
                return BadRequest("La categoría especificada no existe.");
            }

            string imageUrl;

            if (productoDto.ImagenFile != null && productoDto.ImagenFile.Length > 0)
            {
                // Handle file upload
                var uploadsFolderPath = Path.Combine(_env.WebRootPath, "images", "products");
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{productoDto.ImagenFile.FileName}";
                var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productoDto.ImagenFile.CopyToAsync(stream);
                }

                imageUrl = $"/images/products/{uniqueFileName}";
            }
            else
            {
                // Use provided URL
                imageUrl = productoDto.ImagenURL!;
            }

            var producto = new Producto
            {
                Nombre = productoDto.Nombre,
                Descripcion = productoDto.Descripcion,
                Precio = productoDto.Precio,
                Stock = productoDto.Stock,
                CategoriaID = productoDto.CategoriaID,
                ImagenURL = imageUrl,
                Activo = productoDto.Activo
            };

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            _activityService.LogActivity(
                GetAdminName(),
                "Crear Producto",
                $"Se creó el producto '{producto.Nombre}' con ID {producto.ProductoID}",
                "Producto",
                producto.ProductoID
            );

            var productoCreadoDto = new ProductoDto
            {
                ProductoID = producto.ProductoID,
                Nombre = producto.Nombre,
                Descripcion = producto.Descripcion,
                Precio = producto.Precio,
                Stock = producto.Stock,
                CategoriaNombre = categoria.Nombre,
                ImagenURL = producto.ImagenURL,
                Activo = producto.Activo
            };

            return CreatedAtAction(nameof(GetProducto), new { id = producto.ProductoID }, productoCreadoDto);
        }

        // PUT: api/productos/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProducto(int id, [FromForm] CrearProductoDto productoDto)
        {
            _logger.LogInformation($"Request to update product ID: {id}");

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            var categoria = await _context.Categorias.FindAsync(productoDto.CategoriaID);
            if (categoria == null)
            {
                return BadRequest("La categoría especificada no existe.");
            }

            if (productoDto.ImagenFile != null && productoDto.ImagenFile.Length > 0)
            {
                var uploadsFolderPath = Path.Combine(_env.WebRootPath, "images", "products");
                if (!Directory.Exists(uploadsFolderPath))
                {
                    Directory.CreateDirectory(uploadsFolderPath);
                }

                if (!string.IsNullOrEmpty(producto.ImagenURL) && !producto.ImagenURL.StartsWith("http"))
                {
                    var oldFileName = Path.GetFileName(new Uri("http://dummybase.com" + producto.ImagenURL).AbsolutePath);
                    var oldFilePath = Path.Combine(uploadsFolderPath, oldFileName);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{productoDto.ImagenFile.FileName}";
                var filePath = Path.Combine(uploadsFolderPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await productoDto.ImagenFile.CopyToAsync(stream);
                }
                producto.ImagenURL = $"/images/products/{uniqueFileName}";
            }
            else if (!string.IsNullOrEmpty(productoDto.ImagenURL))
            {
                producto.ImagenURL = productoDto.ImagenURL;
            }

            producto.Nombre = productoDto.Nombre;
            producto.Descripcion = productoDto.Descripcion;
            producto.Precio = productoDto.Precio;
            producto.Stock = productoDto.Stock;
            producto.CategoriaID = productoDto.CategoriaID;
            producto.Activo = productoDto.Activo;

            try
            {
                await _context.SaveChangesAsync();

                _activityService.LogActivity(
                    GetAdminName(),
                    "Actualizar Producto",
                    $"Se actualizó el producto '{producto.Nombre}' (ID: {id})",
                    "Producto",
                    id
                );
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Productos.Any(e => e.ProductoID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/productos/5 (Soft Delete)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            _logger.LogInformation($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path} (Soft Delete)");

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            producto.Activo = false;
            await _context.SaveChangesAsync();
            
            _activityService.LogActivity(
                GetAdminName(),
                "Desactivar Producto",
                $"Se desactivó el producto '{producto.Nombre}' (ID: {id})",
                "Producto",
                id
            );

            return NoContent();
        }

        // DELETE: api/productos/force/5 (Hard Delete)
        [HttpDelete("force/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ForceDeleteProducto(int id)
        {
            _logger.LogWarning($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path} (HARD DELETE)");

            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(producto.ImagenURL) && !producto.ImagenURL.StartsWith("http"))
            {
                var uploadsFolderPath = Path.Combine(_env.WebRootPath, "images", "products");
                var fileName = Path.GetFileName(producto.ImagenURL);
                var imagePath = Path.Combine(uploadsFolderPath, fileName);

                if (System.IO.File.Exists(imagePath))
                {
                    try
                    {
                        System.IO.File.Delete(imagePath);
                        _logger.LogInformation($"Deleted image file: {imagePath}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Error deleting image file: {imagePath}");
                    }
                }
            }

            var nombreProducto = producto.Nombre;
            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            _activityService.LogActivity(
                GetAdminName(),
                "Eliminar Producto",
                $"Se eliminó PERMANENTEMENTE el producto '{nombreProducto}' (ID: {id})",
                "Producto",
                id
            );

            return NoContent();
        }

        // GET: api/productos/welcome
        [HttpGet("welcome")]
        public IActionResult Welcome()
        {
            _logger.LogInformation($"Request: {HttpContext.Request.Method} {HttpContext.Request.Path}");

            return Ok(new { message = "Welcome to the MascotaSnacks API!" });
        }
    }
}
