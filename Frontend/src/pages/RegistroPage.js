import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import authService from '../services/authService';
import { Box, TextField, Button, Typography, Container, Alert, Link, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const RegistroPage = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!nombre || !apellido || !email || !password) {
        setError('Todos los campos son obligatorios.');
        return;
    }

    try {
      await authService.register({ nombre, apellido, email, password });
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError('Error en el registro. Es posible que el correo ya esté en uso.');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Crear una Cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="nombre" label="Nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextField margin="normal" required fullWidth id="apellido" label="Apellido" name="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
          <TextField margin="normal" required fullWidth id="email" label="Correo Electrónico" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

          {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Registrarse
          </Button>
          <Link component={RouterLink} to="/login" variant="body2">
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistroPage;