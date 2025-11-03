using Microsoft.EntityFrameworkCore;
using MascotaSnacksAPI.Models;

namespace MascotaSnacksAPI.Data
{
    public class MascotaSnacksContext : DbContext
    {
        public MascotaSnacksContext(DbContextOptions<MascotaSnacksContext> options) : base(options)
        {
        }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Mascota> Mascotas { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<DetallePedido> DetallesPedidos { get; set; }
        public DbSet<Carrito> Carritos { get; set; }
        public DbSet<ItemsCarrito> ItemsCarritos { get; set; }
        public DbSet<Favorito> Favoritos { get; set; }

        public DbSet<Administrador> Administradores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Definir llaves compuestas o relaciones complejas si es necesario
            // Por ejemplo, para la tabla de Favoritos, para asegurar que un cliente no pueda
            // agregar el mismo producto dos veces a favoritos.
            modelBuilder.Entity<Favorito>()
                .HasIndex(f => new { f.ClienteID, f.ProductoID })
                .IsUnique();

             modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Carrito)
                .WithOne(c => c.Cliente)
                .HasForeignKey<Carrito>(c => c.ClienteID);
        }
    }
}