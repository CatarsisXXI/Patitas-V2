using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Data;
using MascotaSnacksAPI.Models;
using MascotaSnacksAPI.DTOs.Auth;
using MascotaSnacksAPI.Services;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using MascotaSnacksAPI.DTOs.Admin;

namespace MascotaSnacksAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MascotaSnacksContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(MascotaSnacksContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegistroClienteDto registroDto)
        {
            if (await _context.Clientes.AnyAsync(x => x.Email == registroDto.Email))
            {
                return BadRequest("El email ya está registrado.");
            }

            using var hmac = new HMACSHA512();

            var cliente = new Cliente
            {
                Nombre = registroDto.Nombre,
                Apellido = registroDto.Apellido,
                Email = registroDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registroDto.Password)),
                PasswordSalt = hmac.Key,
                FechaRegistro = System.DateTime.UtcNow
            };

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Email = cliente.Email,
                Nombre = $"{cliente.Nombre} {cliente.Apellido}".Trim(),
                Token = _tokenService.CreateToken(cliente)
            };
        }

        [HttpPost("register/admin")]
        public async Task<ActionResult<UserDto>> RegisterAdmin(CrearAdminDto registroDto)
        {
            if (await _context.Administradores.AnyAsync(x => x.Usuario == registroDto.Usuario))
            {
                return BadRequest("El nombre de usuario ya existe.");
            }

            using var hmac = new HMACSHA512();

            var admin = new Administrador
            {
                Usuario = registroDto.Usuario,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registroDto.Password)),
                PasswordSalt = hmac.Key,
                NombreCompleto = registroDto.NombreCompleto,
                Rol = registroDto.Rol
            };

            _context.Administradores.Add(admin);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Email = admin.Usuario,
                Nombre = admin.NombreCompleto,
                Token = _tokenService.CreateToken(admin)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var cliente = await _context.Clientes.SingleOrDefaultAsync(x => x.Email == loginDto.Email);

            if (cliente == null)
            {
                return Unauthorized("Email o contraseña inválidos.");
            }

            using var hmac = new HMACSHA512(cliente.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != cliente.PasswordHash[i])
                {
                    return Unauthorized("Email o contraseña inválidos.");
                }
            }

            return new UserDto
            {
                Email = cliente.Email,
                Nombre = $"{cliente.Nombre} {cliente.Apellido}".Trim(),
                Token = _tokenService.CreateToken(cliente)
            };
        }

        [HttpPost("login/admin")]
        public async Task<ActionResult<UserDto>> LoginAdmin(LoginAdminDto loginDto)
        {
            var admin = await _context.Administradores.SingleOrDefaultAsync(x => x.Usuario == loginDto.Usuario);

            if (admin == null)
            {
                return Unauthorized("Usuario o contraseña inválidos.");
            }

            using var hmac = new HMACSHA512(admin.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != admin.PasswordHash[i])
                {
                    return Unauthorized("Usuario o contraseña inválidos.");
                }
            }

            return new UserDto
            {
                Email = admin.Usuario,
                Nombre = admin.NombreCompleto,
                Token = _tokenService.CreateToken(admin)
            };
        }

        [HttpGet("seed-admin")]
        public async Task<IActionResult> SeedAdmin()
        {
            // Borra el admin existente para asegurar un estado limpio
            var existingAdmin = await _context.Administradores.FirstOrDefaultAsync(a => a.Usuario == "admin");
            if (existingAdmin != null)
            {
                _context.Administradores.Remove(existingAdmin);
            }

            // Crea un nuevo admin con la contraseña hasheada correctamente
            using var hmac = new HMACSHA512();
            var admin = new Administrador
            {
                Usuario = "admin",
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Admin123456")),
                PasswordSalt = hmac.Key,
                NombreCompleto = "Administrador Principal",
                Rol = "Admin"
            };

            await _context.Administradores.AddAsync(admin);
            await _context.SaveChangesAsync();

            return Ok("Administrador 'admin' reseteado exitosamente. Contraseña: Admin123456. Ya puedes iniciar sesión.");
        }
    }
}
