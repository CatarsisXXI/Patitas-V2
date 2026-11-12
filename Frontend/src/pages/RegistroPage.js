import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import { errorMessage } from '../config/api';
import PasswordField from '../components/ui/PasswordField';
import { color } from '../theme/tokens';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8; // mismo mínimo que valida el backend

const validate = ({ nombre, apellido, email, password }) => ({
  nombre: nombre.trim() ? '' : 'Escribe tu nombre.',
  apellido: apellido.trim() ? '' : 'Escribe tu apellido.',
  email: !email.trim() ? 'Escribe tu correo.' : EMAIL.test(email.trim()) ? '' : 'Ese correo no parece válido.',
  password: password.length >= MIN_PASSWORD ? '' : `Usa al menos ${MIN_PASSWORD} caracteres.`,
});

const RegistroPage = () => {
  const { user, login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && !loading) return <Navigate to={from || '/'} replace />;

  const errors = validate(form);
  const field = (name) => ({
    id: name,
    name,
    value: form[name],
    fullWidth: true,
    onChange: (event) => setForm((prev) => ({ ...prev, [name]: event.target.value })),
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    error: !!touched[name] && !!errors[name],
  });
  const hint = (name, fallback = ' ') => (touched[name] && errors[name] ? errors[name] : fallback);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ nombre: true, apellido: true, email: true, password: true });
    setError('');
    if (Object.values(errors).some(Boolean)) return;

    setLoading(true);
    try {
      const session = await authService.register({ nombre: form.nombre.trim(), apellido: form.apellido.trim(), email: form.email.trim(), password: form.password });
      if (session?.token) {
        login(session);
        notify('Cuenta creada. Registra a tu mascota para recibir recomendaciones.');
        navigate(from || '/mascotas', { replace: true });
      } else {
        notify('Cuenta creada. Ya puedes iniciar sesión.');
        navigate('/login', { replace: true });
      }
    } catch (registerError) {
      setError(errorMessage(registerError, 'No pudimos crear la cuenta. Es posible que el correo ya esté en uso.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Crea tu cuenta en <em>un minuto</em>.
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
        Después podrás registrar a tu mascota y recibir recomendaciones a su medida.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField {...field('nombre')} label="Nombre" autoComplete="given-name" autoFocus helperText={hint('nombre')} />
          <TextField {...field('apellido')} label="Apellido" autoComplete="family-name" helperText={hint('apellido')} />
        </Box>
        <TextField {...field('email')} label="Correo electrónico" type="email" autoComplete="email" helperText={hint('email')} />
        <PasswordField {...field('password')} label="Contraseña" autoComplete="new-password" helperText={hint('password', `Mínimo ${MIN_PASSWORD} caracteres.`)} />

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ mt: 0.5 }} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </Box>

      <Typography sx={{ mt: 4, color: 'text.secondary' }}>
        ¿Ya tienes cuenta?{' '}
        <Box component={Link} to="/login" state={location.state} sx={{ color: color.olive[700], fontWeight: 650, '&:hover': { textDecoration: 'underline', textUnderlineOffset: 3 } }}>
          Iniciar sesión
        </Box>
      </Typography>
    </>
  );
};

export default RegistroPage;
