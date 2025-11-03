# TODO List para MascotaSnacksAPI

## Backend
- [x] Crear modelos (Cliente, Producto, Categoria, Mascota, Pedido, DetallesPedido, Carrito, ItemsCarrito, Favorito, Administrador)
- [x] Crear DTOs (Auth, Productos, Categorias)
- [x] Crear servicios (TokenService)
- [x] Crear DataContext y Program.cs
- [x] Crear AuthController con login unificado (cliente/admin)
- [x] Crear ProductosController con CRUD completo y campo Activo
- [x] Crear CategoriasController
- [x] Crear CarritoController
- [x] Crear FavoritosController
- [x] Crear PedidosController
- [x] Implementar lógica de negocio (actualizar stock, validar pedidos, etc.)
- [x] Crear MascotasController
- [x] Crear AdministradoresController
- [x] Crear migraciones y aplicar base de datos
- [x] Agregar filtros y búsqueda en ProductosController
- [x] Implementar roles (Cliente, Admin)
- [x] Corregir TokenService para usar NombreCompleto en lugar de Usuario para admins
- [x] Limpiar administradores existentes y crear nuevo admin con credenciales conocidas
- [x] Modificar AuthController y TokenService para incluir nombre completo (primer nombre + primer apellido) en tokens de clientes

## Frontend
- [x] Crear proyecto React
- [x] Crear componentes: Login unificado, Registro, Productos, Carrito, Favoritos, Admin
- [x] Integrar con API
- [x] Agregar filtros y búsqueda
- [x] Implementar carrito de compras
- [x] Crear interfaz de admin completa con gestión de productos
- [x] Login unificado que detecta automáticamente si es cliente o admin
- [x] Redirección automática a panel admin para administradores
- [x] Gestión completa de productos (CRUD) con todos los campos requeridos
- [x] Campo Activo para activar/desactivar productos
- [x] Integración con API de categorías
- [x] Moneda cambiada a Soles (S/)
- [x] Modificar navbar para mostrar "Hola, [primer nombre] [primer apellido]" para admins
- [x] Modificar navbar para mostrar nombre completo para clientes también

## General
- [x] Eliminar botones temporales "Crear Admin" y "Admin Login" del navbar
- [x] Eliminar páginas temporales CreateAdminPage y AdminLoginPage
- [x] Implementar login unificado que funciona para clientes y administradores
- [x] Corregir extracción del nombre del usuario en navbar
- [x] Cambiar moneda de dólares ($) a soles (S/) en toda la aplicación
- [x] Productos agregados por admin aparecen automáticamente en la página de productos
- [x] Sistema de roles funcionando correctamente
- [x] Crear usuario administrador por defecto
- [x] Corregir redirección automática al panel admin después del login
- [x] Limpiar base de datos de administradores antiguos y crear nuevo admin
- [x] Limpiar funcionalidad de Actividades (eliminada tabla de BD y código relacionado)
- [x] Corregir errores de compilación relacionados con Actividades
- [ ] Testing básico
- [ ] Documentación
- [ ] Preparar para despliegue
