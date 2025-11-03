import { createTheme } from '@mui/material/styles';

// Tema inmersivo y llamativo para la interfaz de administración con colores CRUD
const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Rojo intenso para acciones principales (CRUD)
      light: '#ef5350', // Rojo claro
      dark: '#b71c1c', // Rojo oscuro
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1976d2', // Azul vibrante para acciones secundarias
      light: '#63a4ff', // Azul claro
      dark: '#004ba0', // Azul oscuro
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F6F0', // Crema muy suave (igual que el tema principal)
      paper: '#FFFFFF', // Blanco (igual que el tema principal)
    },
    text: {
      primary: '#5D4E37', // Marrón oscuro suave (igual que el tema principal)
      secondary: '#7D6B5D', // Marrón medio (igual que el tema principal)
    },
    error: {
      main: '#f44336', // Rojo para errores
    },
    warning: {
      main: '#ff9800', // Naranja para advertencias
    },
    info: {
      main: '#2196f3', // Azul para información
    },
    success: {
      main: '#4caf50', // Verde para éxito
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Roboto',
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#5D4E37',
    },
    h2: {
      fontFamily: 'Roboto',
      fontWeight: 700,
      fontSize: '2rem',
      color: '#5D4E37',
    },
    h3: {
      fontFamily: 'Roboto',
      fontWeight: 700,
      fontSize: '1.75rem',
      color: '#5D4E37',
    },
    h4: {
      fontFamily: 'Roboto',
      fontWeight: 700,
      fontSize: '1.5rem',
      color: '#5D4E37',
    },
    h5: {
      fontFamily: 'Roboto',
      fontWeight: 700,
      fontSize: '1.25rem',
      color: '#5D4E37',
    },
    h6: {
      fontFamily: 'Roboto',
      fontWeight: 700,
      fontSize: '1.125rem',
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
      fontFamily: 'Roboto',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '2px', // Bordes más cuadrados para aspecto profesional
          padding: '10px 20px',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
          boxShadow: '0 3px 6px rgba(211, 47, 47, 0.5)',
          '&:hover': {
            background: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
            boxShadow: '0 6px 12px rgba(183, 28, 28, 0.6)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #1976d2 0%, #63a4ff 100%)',
          boxShadow: '0 3px 6px rgba(25, 118, 210, 0.5)',
          '&:hover': {
            background: 'linear-gradient(135deg, #004ba0 0%, #1976d2 100%)',
            boxShadow: '0 6px 12px rgba(0, 75, 160, 0.6)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #D4A574 30%, #A8B5A0 90%)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#5D4E37',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(212, 165, 116, 0.1)',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8F6F0',
          '& .MuiTableCell-head': {
            fontWeight: 700,
            color: '#5D4E37',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(212, 165, 116, 0.05)',
          },
        },
      },
    },
  },
});

export default adminTheme;
