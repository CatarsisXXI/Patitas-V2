using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.Models;
using MascotaSnacksAPI.DTOs.Admin;
using Microsoft.AspNetCore.Authorization;

using System.Security.Claims;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

namespace MascotaSnacksAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdministradoresController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly ILogger<AdministradoresController> _logger;

        public AdministradoresController(MascotaSnacksContext context, ILogger<AdministradoresController> logger)
        {
            _context = context;
            _logger = logger;
        }


        private int GetAdminId()
        {
            // Asumiendo que el ID del admin también se guarda en el claim NameIdentifier
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        // GET: api/Administradores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminDto>>> GetAdministradores()
        {
            var adminId = GetAdminId();
            _logger.LogInformation("Admin {AdminId} requested all administrators.", adminId);

            var admins = await _context.Administradores
                .Select(a => new AdminDto
                {
                    AdminID = a.AdminID,
                    Usuario = a.Usuario,
                    NombreCompleto = a.NombreCompleto,
                    Rol = a.Rol
                })
                .ToListAsync();

            return Ok(admins);
        }

        // GET: api/Administradores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminDto>> GetAdministrador(int id)
        {
            var adminId = GetAdminId();
            _logger.LogInformation("Admin {AdminId} requested administrator with ID {RequestedId}.", adminId, id);

            var admin = await _context.Administradores
                .Where(a => a.AdminID == id)
                .Select(a => new AdminDto
                {
                    AdminID = a.AdminID,
                    Usuario = a.Usuario,
                    NombreCompleto = a.NombreCompleto,
                    Rol = a.Rol
                })
                .FirstOrDefaultAsync();

            if (admin == null)
            {
                return NotFound();
            }

            return Ok(admin);
        }
        
        // POST, PUT, DELETE methods would be added here in the future,
        // likely restricted to a "SuperAdmin" role.

        // GET: api/administradores/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserForAdminDto>>> GetUsers()
        {
            var adminId = GetAdminId();
            _logger.LogInformation("Admin {AdminId} requested all users.", adminId);

            var users = await _context.Clientes
                .Select(c => new UserForAdminDto
                {
                    Id = c.ClienteID,
                    Nombre = c.Nombre,
                    Apellido = c.Apellido,
                    Email = c.Email,
                    IsActive = c.IsActive
                })
                .ToListAsync();

            return Ok(users);
        }

        // PATCH: api/administradores/users/{id}/toggle-status
        [HttpPatch("users/{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var adminId = GetAdminId();
            _logger.LogInformation("Admin {AdminId} requested to toggle status for user {UserId}.", adminId, id);

            var user = await _context.Clientes.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
