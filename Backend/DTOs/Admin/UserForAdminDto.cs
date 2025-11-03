using System;

namespace MascotaSnacksAPI.DTOs.Admin
{
    public class UserForAdminDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}