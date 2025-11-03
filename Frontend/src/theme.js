import { createTheme } from '@mui/material/styles';

// Paleta de colores pastel para Patitas y Sabores
const theme = createTheme({
  palette: {
    primary: {
      main: '#D4A574', // Beige dorado suave
      light: '#E8D5B7', // Beige más claro
      dark: '#B8955D', // Beige más oscuro
      contrastText: '#5D4E37', // Marrón oscuro para texto
    },
    secondary: {
      main: '#A8B5A0', // Verde sage suave
      light: '#C8D1C5', // Verde sage más claro
      dark: '#8A9683', // Verde sage más oscuro
      contrastText: '#5D4E37',
    },
    background: {
      default: '#F8F6F0', // Crema muy suave
      paper: '#FFFFFF', // Blanco
    },
    text: {
      primary: '#5D4E37', // Marrón oscuro suave
      secondary: '#7D6B5D', // Marrón medio
    },
    error: {
      main: '#C4908F', // Rojo pastel suave
    },
    warning: {
      main: '#D4B483', // Amarillo pastel suave
    },
    info: {
      main: '#A8B5C7', // Azul pastel suave
    },
    success: {
      main: '#A8B5A0', // Verde pastel suave
    },
  },
  typography: {
    fontFamily: [
      'Quicksand',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Quicksand',
      fontWeight: 700,
      fontSize: '3rem',
      color: '#5D4E37',
    },
    h2: {
      fontFamily: 'Quicksand',
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#5D4E37',
    },
    h3: {
      fontFamily: 'Quicksand',
      fontWeight: 600,
      fontSize: '2rem',
      color: '#5D4E37',
    },
    h4: {
      fontFamily: 'Quicksand',
      fontWeight: 500,
      fontSize: '1.75rem',
      color: '#5D4E37',
    },
    h5: {
      fontFamily: 'Quicksand',
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#5D4E37',
    },
    h6: {
      fontFamily: 'Quicksand',
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#5D4E37',
    },
    body1: {
      fontFamily: 'Roboto',
      fontSize: '1rem',
      color: '#7D6B5D',
    },
    body2: {
      fontFamily: 'Roboto',
      fontSize: '0.875rem',
      color: '#7D6B5D',
    },
    button: {
      fontFamily: 'Quicksand',
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
