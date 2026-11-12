// Valores base del sistema visual. Todo color, sombra o curva de animación
// de la app sale de aquí; no escribir hexadecimales sueltos en los componentes.

export const color = {
  paper: '#F6F2E7',
  surface: '#FFFDF8',
  sunken: '#EEE8D8',
  ink: '#2B1B10',
  inkSoft: '#5A4535',
  inkMuted: '#75604E',
  line: 'rgba(61, 38, 20, 0.12)',
  lineStrong: 'rgba(61, 38, 20, 0.24)',

  olive: {
    50: '#F1F2E1',
    100: '#E4E7C8',
    300: '#B3BA7C',
    500: '#6B7636',
    600: '#56612B',
    700: '#434C21',
    900: '#2F3618',
  },
  cocoa: '#3D2614',

  success: { main: '#3E6B35', tint: '#E5EEDC' },
  warning: { main: '#8A5A0B', tint: '#F7ECD2', accent: '#C4861A' },
  danger: { main: '#A8452C', tint: '#F8E7E0' },
  info: { main: '#3F6274', tint: '#E1EAEE' },
  whatsapp: '#1B7F4B',
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 36,
  pill: 999,
};

// Sombras teñidas de cacao para que no se vean grises sobre el fondo crema.
export const shadow = {
  xs: '0 1px 2px rgba(61, 38, 20, 0.06)',
  sm: '0 2px 8px -2px rgba(61, 38, 20, 0.10), 0 1px 2px rgba(61, 38, 20, 0.05)',
  md: '0 10px 24px -10px rgba(61, 38, 20, 0.18), 0 2px 6px rgba(61, 38, 20, 0.05)',
  lg: '0 24px 48px -20px rgba(61, 38, 20, 0.28), 0 4px 12px rgba(61, 38, 20, 0.06)',
  focus: '0 0 0 3px rgba(86, 97, 43, 0.32)',
};

export const font = {
  display: '"Fraunces Variable", "Iowan Old Style", Georgia, serif',
  body: '"Figtree Variable", "Segoe UI", system-ui, -apple-system, sans-serif',
};

export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.645, 0.045, 0.355, 1],
  css: {
    out: 'cubic-bezier(0.23, 1, 0.32, 1)',
    inOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  },
};

export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 28 },
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
};

export const layout = {
  navHeight: 72,
  navHeightMobile: 60,
  maxWidth: 1200,
  adminSidebar: 256,
};

export const z = {
  nav: 1100,
  chat: 1150,
  drawer: 1200,
  dialog: 1300,
  toast: 1400,
};
