namespace MascotaSnacksAPI.DTOs.Favoritos
{
    public class FavoritoDto
    {
        public int ProductoID { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? ImagenURL { get; set; }
        public bool Activo { get; set; }
    }
}