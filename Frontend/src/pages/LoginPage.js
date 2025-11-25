import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Alert, 
  InputAdornment, 
  IconButton,
  Paper,
  Fade,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Pets,
  LoginOutlined
} from '@mui/icons-material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First try to login as a client
      let userData = await authService.login({ email, password });
      login(userData);
      navigate('/'); // Redirect to homepage after login
    } catch (clientError) {
      try {
        // If client login fails, try admin login
        let adminData = await authService.loginAdmin({ usuario: email, password });
        login(adminData);
        navigate('/admin'); // Redirect to admin dashboard after login
      } catch (adminError) {
        // Both login attempts failed
        setError('Credenciales incorrectas. Verifica tu email/usuario y contraseña.');
        console.error('Login failed for both client and admin:', clientError, adminError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F8F6F0 0%, #FAF9F6 50%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(212, 165, 116, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          left: '-50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(168, 181, 160, 0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(93, 78, 55, 0.12)',
              border: '1px solid rgba(212, 165, 116, 0.2)'
            }}
          >
            {/* Logo y título */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 100%)',
                  boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3)',
                  mb: 2,
                  animation: 'float 3s ease-in-out infinite'
                }}
              >
                <Pets sx={{ fontSize: 40, color: '#FFFFFF' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#5D4E37',
                  mb: 1,
                  background: 'linear-gradient(135deg, #D4A574 0%, #8A7B5D 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                ¡Bienvenido de vuelta!
              </Typography>
              <Typography variant="body2" sx={{ color: '#7D6B5D' }}>
                Inicia sesión para continuar con Patitas y Sabores
              </Typography>
            </Box>

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email o Usuario"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#D4A574' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(248, 246, 240, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(248, 246, 240, 0.8)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D4A574',
                        borderWidth: '2px'
                      }
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#D4A574'
                  }
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#A8B5A0' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{
                          color: '#7D6B5D',
                          '&:hover': {
                            color: '#5D4E37',
                            backgroundColor: 'rgba(212, 165, 116, 0.1)'
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(248, 246, 240, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(248, 246, 240, 0.8)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#A8B5A0',
                        borderWidth: '2px'
                      }
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#A8B5A0'
                  }
                }}
              />

              {/* Error Alert */}
              {error && (
                <Fade in={!!error}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 2,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      border: '1px solid rgba(211, 47, 47, 0.3)',
                      '& .MuiAlert-icon': {
                        color: '#d32f2f'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(212, 165, 116, 0.3)',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 24px rgba(212, 165, 116, 0.4)',
                    background: 'linear-gradient(135deg, #B8955D 0%, #8A9683 100%)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 100%)',
                    opacity: 0.6
                  }
                }}
                startIcon={loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <LoginOutlined />}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 3, color: '#7D6B5D' }}>
                <Typography variant="body2" sx={{ color: '#7D6B5D', px: 2 }}>
                  ó
                </Typography>
              </Divider>

              {/* Register Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#7D6B5D' }}>
                  ¿No tienes una cuenta?{' '}
                  <Box
                    component={RouterLink}
                    to="/registro"
                    sx={{
                      color: '#D4A574',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: '#B8955D',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Regístrate aquí
                  </Box>
                </Typography>
              </Box>

              {/* Forgot Password */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Box
                  component={RouterLink}
                  to="/recuperar-password"
                  sx={{
                    color: '#7D6B5D',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#5D4E37',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Footer Text */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#7D6B5D' }}>
            Al iniciar sesión, aceptas nuestros{' '}
            <Box
              component={RouterLink}
              to="/terminos"
              sx={{
                color: '#D4A574',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Términos y Condiciones
            </Box>
          </Typography>
        </Box>
      </Container>

      {/* Animación float para el logo */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoginPage;