namespace MascotaSnacksAPI.DTOs.Admin
{
    public class DashboardStatsDto
    {
        public int TotalProductos { get; set; }
        public int TotalPedidos { get; set; }
        public int TotalUsuarios { get; set; }
        public decimal VentasTotales { get; set; }
    }
}