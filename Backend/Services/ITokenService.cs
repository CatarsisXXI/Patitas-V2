using MascotaSnacksAPI.Models;

namespace MascotaSnacksAPI.Services
{
    public interface ITokenService
    {
        string CreateToken(Cliente cliente);
        string CreateToken(Administrador admin);
    }
}