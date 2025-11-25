import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Person,
  Pets,
  HowToRegOutlined
} from '@mui/icons-material';

const RegistroPage = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!nombre || !apellido || !email || !password) {
      setError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    try {
      await authService.register({ nombre, apellido, email, password });
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error en el registro. Es posible que el correo ya esté en uso.');
      console.error(err);
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
        background: '#e6e5c9',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: '#e6e5c9',
          borderRadius: '50%'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          left: '-50%',
          width: '100%',
          height: '100%',
          background: '#e6e5c9',
          borderRadius: '50%'
        }
      }}
    >
      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
                ¡Únete a nosotros!
              </Typography>
              <Typography variant="body2" sx={{ color: '#7D6B5D' }}>
                Crea tu cuenta en Patitas y Sabores
              </Typography>
            </Box>

            {/* Formulario */}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Nombre y Apellido en fila */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#D4A574' }} />
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
                  required
                  fullWidth
                  id="apellido"
                  label="Apellido"
                  name="apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#D4A574' }} />
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
              </Box>

              {/* Email */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#A8B5A0' }} />
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

              {/* Password */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#7D6B5D' }} />
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
                        borderColor: '#7D6B5D',
                        borderWidth: '2px'
                      }
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#7D6B5D'
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

              {/* Success Alert */}
              {success && (
                <Fade in={!!success}>
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mt: 2,
                      borderRadius: '12px',
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      border: '1px solid rgba(46, 125, 50, 0.3)',
                      '& .MuiAlert-icon': {
                        color: '#2e7d32'
                      }
                    }}
                  >
                    {success}
                  </Alert>
                </Fade>
              )}

              {/* Register Button */}
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
                startIcon={loading ? <CircularProgress size={20} sx={{ color: '#FFFFFF' }} /> : <HowToRegOutlined />}
              >
                {loading ? 'Creando cuenta...' : 'Registrarse'}
              </Button>

              {/* Divider */}
              <Divider sx={{ my: 3, color: '#7D6B5D' }}>
                <Typography variant="body2" sx={{ color: '#7D6B5D', px: 2 }}>
                  ¿Ya tienes cuenta?
                </Typography>
              </Divider>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#7D6B5D' }}>
                  ¿Ya tienes una cuenta?{' '}
                  <Box
                    component={RouterLink}
                    to="/login"
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
                    Inicia sesión aquí
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Footer Text */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#7D6B5D' }}>
            Al registrarte, aceptas nuestros{' '}
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

export default RegistroPage;