import { createTheme } from '@mui/material/styles';

// Paleta de colores pastel para Patitas y Sabores
const theme = createTheme({
  palette: {
    primary: {
      main: '#7f814d', // Verde oliva Apagado
      light: '#e6e5c9', // Amarillo Claro
      dark: '#55572f', // Verde oliva oscuro apagado
      contrastText: '#3d210a', // Marrón Oscuro para texto
    },
    secondary: {
      main: '#886137', // Marrón Claro
      light: '#e6e5c9', // Amarillo Claro
      dark: '#3d210a', // Marrón Oscuro
      contrastText: '#55572f', // Verde oliva oscuro apagado
    },
    background: {
      default: '#e6e5c9', // Amarillo Claro
      paper: '#e6e5c9', // Amarillo Claro para paper también
    },
    text: {
      primary: '#3d210a', // Marrón Oscuro
      secondary: '#7f814d', // Verde oliva Apagado
    },
    error: {
      main: '#C4908F', // Mantengo como estaba
    },
    warning: {
      main: '#D4B483', // Mantengo como estaba
    },
    info: {
      main: '#7f814d', // Verde oliva Apagado
    },
    success: {
      main: '#7f814d', // Verde oliva Apagado
    },
  },
  typography: {
    fontFamily: [
      '"Anicon Slab"',
      'Chewy',
      'Quicksand',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: '"Anicon Slab", serif',
      fontWeight: 700,
      fontSize: '3rem',
      color: '#886137', // marrón claro
    },
    h2: {
      fontFamily: '"Anicon Slab", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#886137',
    },
    h3: {
      fontFamily: '"Anicon Slab", serif',
      fontWeight: 600,
      fontSize: '2rem',
      color: '#886137',
    },
    h4: {
      fontFamily: '"Anicon Slab", serif',
      fontWeight: 500,
      fontSize: '1.75rem',
      color: '#886137',
    },
    h5: {
      fontFamily: '"Anicon Slab", serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#886137',
    },
    h6: {
      fontFamily: '"Anicon Slab", serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#886137',
    },
    body1: {
      fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
      fontSize: '1rem',
      color: '#3d210a', // marrón oscuro
    },
    body2: {
      fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
      fontSize: '0.875rem',
      color: '#3d210a',
    },
    button: {
      fontFamily: '"Anicon Slab", serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          padding: '12px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #D4A574 30%, #A8B5A0 90%)',
          boxShadow: '0 3px 5px 2px rgba(212, 165, 116, .3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #D4A574 30%, #A8B5A0 90%)',
          boxShadow: '0 3px 5px 2px rgba(212, 165, 116, .3)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
});

export default theme;
