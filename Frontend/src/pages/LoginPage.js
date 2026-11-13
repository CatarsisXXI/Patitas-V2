import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import PasswordField from '../components/ui/PasswordField';
import { color } from '../theme/tokens';

const LoginPage = () => {
  const { user, login, isAdmin } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && !loading) return <Navigate to={isAdmin ? '/admin' : from || '/'} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    setError('');
    if (!email.trim() || !password) return;

    setLoading(true);
    try {
      // El mismo formulario sirve a clientes y administradores: primero se prueba como cliente.
      let session;
      let admin = false;
      try {
        session = await authService.login({ email: email.trim(), password });
      } catch (clientError) {
        if (!clientError.response) throw clientError;
        session = await authService.loginAdmin({ usuario: email.trim(), password });
        admin = true;
      }
      const logged = login(session);
      notify(`Hola, ${logged.firstName || 'bienvenido'}.`);
      navigate(admin ? '/admin' : from || '/', { replace: true });
    } catch (loginError) {
      setError(loginError.response ? 'El correo o la contraseña no coinciden. Revísalos e inténtalo otra vez.' : 'No pudimos conectar con el servidor. Revisa tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Qué bueno verte de <em>nuevo</em>.
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
        Ingresa para ver tu carrito, tus mascotas y tus pedidos.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2.5 }}>
        <TextField
          id="email"
          name="email"
          label="Correo o usuario"
          autoComplete="username"
          autoFocus
          fullWidth
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={touched && !email.trim()}
          helperText={touched && !email.trim() ? 'Escribe tu correo o usuario.' : ' '}
        />
        <PasswordField
          id="password"
          name="password"
          label="Contraseña"
          autoComplete="current-password"
          fullWidth
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={touched && !password}
          helperText={touched && !password ? 'Escribe tu contraseña.' : ' '}
        />

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </Box>

      <Typography sx={{ mt: 4, color: 'text.secondary' }}>
        ¿Aún no tienes cuenta?{' '}
        <Box component={Link} to="/registro" state={location.state} sx={{ color: color.olive[700], fontWeight: 650, '&:hover': { textDecoration: 'underline', textUnderlineOffset: 3 } }}>
          Crear cuenta
        </Box>
      </Typography>
    </>
  );
};

export default LoginPage;
