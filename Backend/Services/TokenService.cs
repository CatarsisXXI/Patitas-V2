using MascotaSnacksAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using Microsoft.Extensions.Configuration;

namespace MascotaSnacksAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
            // La clave debe tener un tamaño suficiente para el algoritmo HMACSHA512
            var keyString = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString) || keyString.Length < 64)
            {
                throw new ArgumentException("La clave JWT debe estar definida en appsettings y tener al menos 64 caracteres.");
            }
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        }

        public string CreateToken(Cliente cliente)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, cliente.ClienteID.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, $"{cliente.Nombre} {cliente.Apellido}".Trim()),
                new Claim(JwtRegisteredClaimNames.Email, cliente.Email),
                new Claim(ClaimTypes.Role, "Cliente")
            };



            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string CreateToken(Administrador admin)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, admin.AdminID.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, admin.NombreCompleto),
                new Claim(ClaimTypes.Role, admin.Rol)
            };



            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1), // Shorter expiry for admins
                SigningCredentials = creds,
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}