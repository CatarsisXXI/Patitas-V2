# Patitas y Sabores

Tienda en línea de snacks naturales para perros y gatos. Incluye catálogo, carrito con pedido por WhatsApp, perfil de mascotas con un asistente de recomendaciones (Coco) y un panel de administración.

| Carpeta | Qué contiene |
|---|---|
| `Backend/` | API REST en ASP.NET Core 9 con Entity Framework Core y SQL Server |
| `Frontend/` | Aplicación web en React 19 con Material UI 7 |
| `MascotasSnacksDB1.bacpac` | Copia de la base de datos, por si prefieres importarla en vez de crearla vacía |

## Requisitos

- [.NET SDK 9](https://dotnet.microsoft.com/download)
- SQL Server (Express, Developer o LocalDB). En macOS o Linux puedes usar la imagen de Docker `mcr.microsoft.com/mssql/server`.
- [Node.js](https://nodejs.org/) 18 o superior, con npm

## Cómo correr el proyecto en local

Necesitas dos terminales: una para el backend y otra para el frontend. Arranca primero el backend.

### 1. Configura la base de datos

Abre `Backend/appsettings.json` y cambia `ConnectionStrings:DefaultConnection` para que apunte a tu instancia de SQL Server. El valor que viene en el repositorio es el de la máquina donde se desarrolló y no funcionará en la tuya.

Ejemplos:

```text
# SQL Server Express con autenticación de Windows
Server=localhost\SQLEXPRESS;Database=MascotasSnacksDB1;Trusted_Connection=True;TrustServerCertificate=True;

# LocalDB (viene con Visual Studio)
Server=(localdb)\MSSQLLocalDB;Database=MascotasSnacksDB1;Trusted_Connection=True;

# SQL Server en Docker, o con usuario y contraseña
Server=localhost,1433;Database=MascotasSnacksDB1;User Id=sa;Password=TU_CLAVE;TrustServerCertificate=True;
```

En el archivo JSON la barra invertida se escribe doble: `localhost\\SQLEXPRESS`.

Después crea la base de datos con una de estas dos opciones.

**Opción A: base vacía con las migraciones**

```bash
cd Backend
```

```bash
dotnet tool restore
```

```bash
dotnet ef database update
```

Al arrancar por primera vez, el backend agrega categorías, tres productos de ejemplo y un usuario administrador (ver más abajo).

**Opción B: importar la copia incluida**

En SQL Server Management Studio: clic derecho en *Databases* → *Import Data-tier Application* → elige `MascotasSnacksDB1.bacpac` y usa el nombre `MascotasSnacksDB1`.

### 2. Arranca el backend

```bash
cd Backend
```

```bash
dotnet restore
```

```bash
dotnet run --launch-profile http
```

La API queda en `http://localhost:5288`. Puedes explorarla en `http://localhost:5288/swagger`.

Al iniciar verás el aviso *Failed to determine the https port for redirect*. Es normal con el perfil `http` y no afecta el funcionamiento.

### 3. Arranca el frontend

En otra terminal:

```bash
cd Frontend
```

```bash
npm install
```

```bash
npm start
```

La tienda se abre en `http://localhost:3000`.

El frontend busca la API en `http://localhost:5288`. Si la tuya corre en otra dirección, copia `Frontend/.env.example` como `Frontend/.env`, cambia `REACT_APP_API_URL` y reinicia `npm start`.

### 4. Entra a la aplicación

- **Cliente:** crea una cuenta desde *Crear cuenta*. Luego registra una mascota en *Mis mascotas* para que Coco pueda recomendarte productos.
- **Administrador:** inicia sesión en la misma pantalla de login con el usuario `admin` y la contraseña `Admin123456`. Ese usuario lo crea `Backend/Data/DataSeeder.cs` cuando la tabla de administradores está vacía. Cambia la contraseña antes de publicar el sitio.

Los tres productos de ejemplo no traen imagen. Desde *Panel → Productos* puedes editarlos o crear los reales; las fotos de los productos de la marca están en `Backend/wwwroot/images/products/`.

## Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| El catálogo dice "No pudimos cargar el catálogo" | El backend no está corriendo o `REACT_APP_API_URL` apunta a otro lugar. Comprueba que `http://localhost:5288/swagger` abre. |
| Error de CORS en la consola del navegador | El backend solo acepta peticiones desde `http://localhost:3000` (`Backend/Program.cs`). Si el frontend usa otro puerto o dominio, agrégalo ahí. |
| El backend se cierra al arrancar con un error de SQL | La cadena de conexión no es válida o la base no existe. Repite el paso 1. |
| `dotnet ef` no se reconoce | Ejecuta `dotnet tool restore` dentro de `Backend/`. |

## Comandos del frontend

Ejecútalos dentro de `Frontend/`.

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo con recarga automática |
| `npm test` | Pruebas (unitarias y de humo) |
| `npm run build` | Versión de producción en `Frontend/build/` |

## Antes de publicar

- **Credenciales:** `Backend/appsettings.json` está versionado con la cadena de conexión y la clave JWT. Muévelas a variables de entorno o *user secrets* y genera valores nuevos.
- **CORS:** agrega el dominio público del frontend en `Backend/Program.cs`.
- **URL de la API:** compila el frontend con `REACT_APP_API_URL` apuntando al backend público. El valor se fija al compilar.
- **Rutas del frontend:** es una aplicación de una sola página. Configura el hosting para que cualquier ruta devuelva `index.html`.
- **Datos de la boleta:** el RUC, la dirección y el teléfono que se imprimen son de ejemplo. Cámbialos en `Frontend/src/config/site.js`.

Más detalle sobre la organización del frontend en [`Frontend/README.md`](Frontend/README.md).
