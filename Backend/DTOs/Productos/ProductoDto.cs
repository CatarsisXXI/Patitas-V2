namespace MascotaSnacksAPI.DTOs.Productos
{
    public class ProductoDto
    {
        public int ProductoID { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string CategoriaNombre { get; set; } = string.Empty;
        public string? ImagenURL { get; set; }
        public bool Activo { get; set; }
    }
}