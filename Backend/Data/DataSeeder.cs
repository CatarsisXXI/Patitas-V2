using MascotaSnacksAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Text;

namespace MascotaSnacksAPI.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(MascotaSnacksContext context)
        {
            // Seed categories if none exist
            if (!await context.Categorias.AnyAsync())
            {
                var categories = new[]
                {
                    new Categoria { Nombre = "Snacks para Perro", Descripcion = "Deliciosos snacks especialmente para perros" },
                    new Categoria { Nombre = "Snacks para Gato", Descripcion = "Sabrosos snacks para felinos" },
                    new Categoria { Nombre = "Accesorios", Descripcion = "Accesorios y juguetes para mascotas" }
                };

                await context.Categorias.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }

            // Seed products if none exist
            if (!await context.Productos.AnyAsync())
            {
                var categories = await context.Categorias.ToListAsync();
                var perroCategory = categories.FirstOrDefault(c => c.Nombre == "Snacks para Perro");
                var gatoCategory = categories.FirstOrDefault(c => c.Nombre == "Snacks para Gato");

                if (perroCategory != null && gatoCategory != null)
                {
                    var products = new[]
                    {
                        new Producto
                        {
                            Nombre = "Huesos de Pollo",
                            Descripcion = "Huesos crujientes de pollo para perros de todos los tamaños",
                            Precio = 15.99m,
                            Stock = 50,
                            CategoriaID = perroCategory.CategoriaID,
                            ImagenURL = "/images/products/huesos-pollo.jpg",
                            Activo = true,
                            FechaCreacion = DateTime.Now
                        },
                        new Producto
                        {
                            Nombre = "Bolas de Pescado",
                            Descripcion = "Bolas de pescado deshidratado, perfectas para gatos",
                            Precio = 12.50m,
                            Stock = 30,
                            CategoriaID = gatoCategory.CategoriaID,
                            ImagenURL = "/images/products/bolas-pescado.jpg",
                            Activo = true,
                            FechaCreacion = DateTime.Now
                        },
                        new Producto
                        {
                            Nombre = "Galletas de Carne",
                            Descripcion = "Galletas con sabor a carne para perros pequeños",
                            Precio = 8.75m,
                            Stock = 75,
                            CategoriaID = perroCategory.CategoriaID,
                            ImagenURL = "/images/products/galletas-carne.jpg",
                            Activo = true,
                            FechaCreacion = DateTime.Now
                        }
                    };

                    await context.Productos.AddRangeAsync(products);
                    await context.SaveChangesAsync();
                }
            }

            // Seed admin user if none exists
            if (!await context.Administradores.AnyAsync())
            {
                using var hmac = new HMACSHA512();
                var admin = new Administrador
                {
                    Usuario = "admin",
                    PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Admin123456")),
                    PasswordSalt = hmac.Key,
                    NombreCompleto = "Administrador Principal",
                    Rol = "SuperAdmin",
                    FechaCreacion = DateTime.Now
                };

                await context.Administradores.AddAsync(admin);
                await context.SaveChangesAsync();
            }
        }
    }
}