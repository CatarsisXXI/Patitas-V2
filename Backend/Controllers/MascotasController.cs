using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.Models;
using MascotaSnacksAPI.DTOs.Mascotas;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace MascotaSnacksAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MascotasController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly ILogger<MascotasController> _logger;

        public MascotasController(MascotaSnacksContext context, ILogger<MascotasController> logger)
        {
            _context = context;
            _logger = logger;
        }


        private int GetClienteId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/Mascotas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MascotaDto>>> GetMascotas()
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            var mascotas = await _context.Mascotas
                .Where(m => m.ClienteID == clienteId)
                .Select(m => new MascotaDto
                {
                    MascotaID = m.MascotaID,
                    Nombre = m.Nombre,
                    Especie = m.Especie,
                    Sexo = m.Sexo,
                    Raza = m.Raza,
                    FechaNacimiento = m.FechaNacimiento,
                    Tamaño = m.Tamaño,
                    NotasAdicionales = m.NotasAdicionales,
                    Avatar = m.Avatar
                })
                .ToListAsync();

            return Ok(mascotas);
        }

        // GET: api/Mascotas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MascotaDto>> GetMascota(int id)
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            var mascota = await _context.Mascotas
                .Where(m => m.ClienteID == clienteId && m.MascotaID == id)
                .Select(m => new MascotaDto
                {
                    MascotaID = m.MascotaID,
                    Nombre = m.Nombre,
                    Especie = m.Especie,
                    Sexo = m.Sexo,
                    Raza = m.Raza,
                    FechaNacimiento = m.FechaNacimiento,
                    Tamaño = m.Tamaño,
                    NotasAdicionales = m.NotasAdicionales,
                    Avatar = m.Avatar
                })
                .FirstOrDefaultAsync();

            if (mascota == null)
            {
                return NotFound();
            }

            return Ok(mascota);
        }
        
        // POST: api/Mascotas
        [HttpPost]
        public async Task<ActionResult<MascotaDto>> PostMascota(CrearMascotaDto mascotaDto)
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var nuevaMascota = new Mascota
            {
                ClienteID = clienteId,
                Nombre = mascotaDto.Nombre,
                Especie = mascotaDto.Especie,
                Sexo = mascotaDto.Sexo,
                Raza = mascotaDto.Raza,
                FechaNacimiento = mascotaDto.FechaNacimiento,
                Tamaño = mascotaDto.Tamaño,
                NotasAdicionales = mascotaDto.NotasAdicionales,
                Avatar = mascotaDto.Avatar
            };

            _context.Mascotas.Add(nuevaMascota);
            await _context.SaveChangesAsync();

            var createdMascotaDto = new MascotaDto
            {
                MascotaID = nuevaMascota.MascotaID,
                Nombre = nuevaMascota.Nombre,
                Especie = nuevaMascota.Especie,
                Sexo = nuevaMascota.Sexo,
                Raza = nuevaMascota.Raza,
                FechaNacimiento = nuevaMascota.FechaNacimiento,
                Tamaño = nuevaMascota.Tamaño,
                NotasAdicionales = nuevaMascota.NotasAdicionales,
                Avatar = nuevaMascota.Avatar
            };

            return CreatedAtAction(nameof(GetMascota), new { id = nuevaMascota.MascotaID }, createdMascotaDto);
        }

        // PUT: api/Mascotas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMascota(int id, CrearMascotaDto mascotaDto)
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            var mascota = await _context.Mascotas
                .FirstOrDefaultAsync(m => m.ClienteID == clienteId && m.MascotaID == id);

            if (mascota == null)
            {
                return NotFound();
            }

            mascota.Nombre = mascotaDto.Nombre;
            mascota.Especie = mascotaDto.Especie;
            mascota.Sexo = mascotaDto.Sexo;
            mascota.Raza = mascotaDto.Raza;
            mascota.FechaNacimiento = mascotaDto.FechaNacimiento;
            mascota.Tamaño = mascotaDto.Tamaño;
            mascota.NotasAdicionales = mascotaDto.NotasAdicionales;
            mascota.Avatar = mascotaDto.Avatar;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Mascotas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMascota(int id)
        {
            var clienteId = GetClienteId();
            _logger.LogInformation("Request received: {Method} {Path} for Cliente ID: {ClienteId}", HttpContext.Request.Method, HttpContext.Request.Path, clienteId);

            var mascota = await _context.Mascotas
                .FirstOrDefaultAsync(m => m.ClienteID == clienteId && m.MascotaID == id);

            if (mascota == null)
            {
                return NotFound();
            }

            _context.Mascotas.Remove(mascota);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
