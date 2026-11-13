# Frontend de Patitas y Sabores

Aplicación web de la tienda. React 19, Material UI 7, React Router 7 y Framer Motion, sobre Create React App.

Para levantar el proyecto completo (base de datos, backend y frontend) sigue el [README de la raíz](../README.md).

## Inicio rápido

```bash
npm install
```

```bash
npm start
```

Abre `http://localhost:3000`. Necesita el backend corriendo en `http://localhost:5288`, o la URL que definas en `.env` (ver `.env.example`).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo |
| `npm test` | Pruebas en modo interactivo. Para una sola pasada: `CI=true npm test` |
| `npm run build` | Versión de producción en `build/`. Con `CI=true` los avisos de ESLint detienen el build |

## Organización del código

```text
src/
  App.js              Rutas. Todas las páginas menos la portada se cargan bajo demanda.
  theme/
    tokens.js         Colores, radios, sombras, tipografías y curvas de animación.
    theme.js          Tema de Material UI de la tienda.
    adminTheme.js     Variante del tema para el panel.
  styles/global.css   Fuentes, fondo, foco visible y reglas de impresión.
  config/
    api.js            Cliente HTTP: URL del backend, token y sesión expirada.
    site.js           Datos del negocio: WhatsApp, redes y datos de la boleta.
  context/            Sesión, carrito, favoritos y notificaciones.
  services/           Una función por endpoint de la API.
  lib/                Lógica sin interfaz, con pruebas: mascotas, recomendaciones,
                      fichas de producto, pedidos y reportes.
  components/
    layout/           Navbar, footer y estructuras de tienda, acceso y panel.
    ui/               Piezas reutilizables: imagen, estados vacíos, diálogos, animación.
    product/ cart/ chat/ pets/ orders/ admin/
  pages/              Una carpeta o archivo por pantalla.
```

## Convenciones

- **Colores y medidas:** se toman de `theme/tokens.js`. No se escriben hexadecimales sueltos en los componentes.
- **Llamadas a la API:** pasan por `services/`, que usa el cliente de `config/api.js`. Las imágenes que devuelve la API se resuelven con `assetUrl()`.
- **Animaciones:** solo `transform` y `opacity`. Las primitivas están en `components/ui/motion.js`. Si el sistema pide menos movimiento, los desplazamientos se omiten.
- **Textos:** en español, sin signos de exclamación en confirmaciones y con mensajes de error que digan qué pasó y qué hacer.
- **Grillas:** CSS Grid mediante `sx`. La API `<Grid item xs={...}>` no existe en Material UI 7.

## Cómo funcionan algunas piezas

- **Coco:** el asistente no llama a un modelo de lenguaje. Aplica las reglas de `lib/recommendations.js` sobre el perfil de la mascota: las alergias excluyen productos y los objetivos, la actividad y la edad acotan la lista.
- **Perfil de salud de la mascota:** se guarda como texto en `notasAdicionales`. El formato lo definen `buildNotas` y `parseNotas` en `lib/pets.js`.
- **Ficha de producto:** la descripción se divide en secciones si incluye los títulos "Perfil del producto:", "Composición funcional:", "Beneficios principales:", "Recomendado para:" y "Evitar en:".
- **Reportes del panel:** se calculan en el navegador a partir de la lista de pedidos (`lib/reports.js`).

## Fotografías

Las fotos de perros de la portada y del acceso provienen de [Unsplash](https://unsplash.com/license) y se sirven desde `public/images/`.
