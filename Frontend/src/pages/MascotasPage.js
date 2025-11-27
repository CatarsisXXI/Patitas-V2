import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Tooltip,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  RadioGroup,
  Radio,
  InputAdornment,
  Box as MuiBox
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import mascotaService from '../services/mascotaService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PetsIcon from '@mui/icons-material/Pets';
import CakeIcon from '@mui/icons-material/Cake';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

// Avatares mejorados con más opciones
const petAvatars = {
  Gato: [
    { id: 'cat1', src: 'https://images.vexels.com/media/users/3/154255/isolated/preview/9afaf910583333c167e40ee094e12cfa-avatar-animal-gato.png', alt: 'Gato Animado 1' },
    { id: 'cat2', src: 'https://images.vexels.com/media/users/3/155407/isolated/preview/84d636131360b843e427a4ff7061ae0a-gato-rayado-avatar.png', alt: 'Gato Animado 2' },
    { id: 'cat3', src: 'https://images.vexels.com/media/users/3/154703/isolated/preview/ba8ca6661d159486337e8b3b6da0ae7b-avatar-de-gato-mascota.png', alt: 'Gato Animado 3' },
    { id: 'cat4', src: 'https://images.vexels.com/media/users/3/155373/isolated/preview/0fc6a08bcea7d5dabd97ec5b156a3155-avatar-de-gato-sonoliento.png', alt: 'Gato Animado 4' },
  ],
  Perro: [
    { id: 'dog1', src: 'https://images.vexels.com/media/users/3/144137/isolated/preview/ca748806d79d3d8d5721d3eb1e663672-ilustracion-de-rottweiler.png', alt: 'Perro Animado 1' },
    { id: 'dog2', src: 'https://images.vexels.com/media/users/3/144928/isolated/lists/ebbccaf76f41f7d83e45a42974cfcd87-ilustracion-de-perro.png', alt: 'Perro Animado 2' },
    { id: 'dog3', src: 'https://images.vexels.com/media/users/3/144116/isolated/preview/a0ade422aae6024947c80e14507b4b15-ilustracion-de-mucuchies.png', alt: 'Perro Animado 3' },
    { id: 'dog4', src: 'https://images.vexels.com/media/users/3/144094/isolated/preview/e1aa7540a5644884d9275b6e95b5c254-ilustracion-de-pastor-aleman.png', alt: 'Perro Animado 4' },
  ]
};

// Opciones predefinidas para formularios
const FORM_OPTIONS = {
  alergias: ['Pollo', 'Cereales', 'Soya', 'Papa', 'Camote', 'Legumbres', 'Aceites vegetales'],
  objetivos: [
    'Control de peso',
    'Aumento de energía o masa muscular',
    'Apoyo Digestivo (digestión sensible)',
    'Piel y pelaje saludables',
    'Soporte articular o movilidad',
    'Soporte inmunológico',
    'Vitalidad y longevidad',
    'Control del nivel de azúcar',
  ],
  nivelesActividad: ['Sedentario', 'Moderadamente activo', 'Muy activo']
};

const MascotasPage = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);
  const [editingMascota, setEditingMascota] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    sexo: '',
    raza: '',
    fechaNacimiento: '',
    tamaño: '',
    notasAdicionales: '',
    avatar: '',
    alergias: [],
    objetivo: [],
    actividad: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchMascotas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMascotas = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      const data = await mascotaService.getMascotas();
      setMascotas(data);
    } catch (err) {
      console.error('Error fetching mascotas:', err);
      setError('No se pudieron cargar las mascotas. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
    } else {
      setError(message);
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 4000);
  };

  const handleOpen = (mascota = null) => {
    if (mascota) {
      setEditingMascota(mascota);
      setActiveStep(0); // iniciar en paso 0 al editar
      const notas = mascota.notasAdicionales || '';

      // intentar parseo JSON primero (si guardaste en ese formato), sino usar el parsing por regex
      let parsed = null;
      try {
        parsed = JSON.parse(notas);
      } catch {
        parsed = null;
      }

      const getSectionFromNotes = (label) => {
        if (parsed && parsed[label]) return parsed[label];
        const regex = new RegExp(`${label}:([^|]+)`, 'i');
        const match = notas.match(regex);
        return match ? match[1].split(',').map(s => s.trim()).filter(Boolean) : [];
      };

      setFormData({
        nombre: mascota.nombre,
        especie: mascota.especie,
        sexo: mascota.sexo || '',
        raza: mascota.raza || '',
        fechaNacimiento: mascota.fechaNacimiento ? mascota.fechaNacimiento.split('T')[0] : '',
        tamaño: mascota.tamaño || '',
        notasAdicionales: mascota.notasAdicionales || '',
        avatar: mascota.avatar || '',
        alergias: getSectionFromNotes('Alergias'),
        objetivo: getSectionFromNotes('Objetivo nutricional'),
        actividad: (parsed && parsed.actividad) || (notas.match(/Nivel de actividad:([^|]+)/i)?.[1]?.trim()) || ''
      });
    } else {
      setEditingMascota(null);
      setFormData({
        nombre: '',
        especie: '',
        sexo: '',
        raza: '',
        fechaNacimiento: '',
        tamaño: '',
        notasAdicionales: '',
        avatar: '',
        alergias: [],
        objetivo: [],
        actividad: ''
      });
      // pequeño timeout para evitar issues con animaciones del Stepper
      setTimeout(() => setActiveStep(0), 50);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMascota(null);
    setTimeout(() => setActiveStep(0), 50);
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // ahora recibe checked explícito
  const handleCheckboxChange = (field, option, checked) => {
    setFormData(prev => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const updated = checked
        ? [...current, option]
        : current.filter(o => o !== option);
      return { ...prev, [field]: updated };
    });
  };

  const calculateAge = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years === 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else if (months === 0) {
      return `${years} ${years === 1 ? 'año' : 'años'}`;
    } else {
      return `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
  };

  const getAgeRange = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    
    if (years >= 0 && years <= 1) return 'Cachorro';
    if (years > 1 && years <= 3) return 'Joven Adulto';
    if (years > 3 && years <= 6) return 'Adulto';
    if (years > 6) return 'Senior';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.especie) {
      showMessage('Por favor completa al menos el nombre y especie de tu mascota', 'error');
      return;
    }

    const notasTexto = `
Alergias: ${formData.alergias?.join(', ') || 'Ninguna'} | 
Objetivo nutricional: ${formData.objetivo?.join(', ') || 'No especificado'} | 
Nivel de actividad: ${formData.actividad || 'No especificado'} |
Edad: ${getAgeRange(formData.fechaNacimiento) || 'No especificado'}
`.trim();

    const mascotaPayload = {
      ...formData,
      notasAdicionales: notasTexto
    };

    try {
      if (editingMascota) {
        await mascotaService.updateMascota(editingMascota.mascotaID, mascotaPayload);
        showMessage('Mascota actualizada exitosamente');
      } else {
        await mascotaService.createMascota(mascotaPayload);
        showMessage('Mascota agregada exitosamente');
      }
      await fetchMascotas();
      handleClose();
    } catch (err) {
      console.error('Error saving mascota:', err);
      showMessage('Error al guardar la mascota. Por favor, intenta nuevamente.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.')) {
      try {
        await mascotaService.deleteMascota(id);
        showMessage('Mascota eliminada exitosamente');
        await fetchMascotas();
      } catch (err) {
        console.error('Error deleting mascota:', err);
        showMessage('Error al eliminar la mascota', 'error');
      }
    }
  };

  const getAvatarOptions = () => {
    return formData.especie ? petAvatars[formData.especie] : [];
  };

  const steps = ['Información Básica', 'Avatar', 'Salud y Bienestar'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2} alignItems="center">
            {/* -------- Fila 1: Nombre | Especie | Sexo | Tamaño -------- */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Nombre de tu mascota"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
                helperText="Cómo llamas a tu compañero peludo"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PetsIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { minHeight: 56 } }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Especie</InputLabel>
                <Select
                  name="especie"
                  value={formData.especie}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      especie: value,
                      // solo limpiar avatar si estamos creando una nueva mascota
                      avatar: editingMascota ? prev.avatar : ''
                    }));
                  }}
                  label="Especie"
                >
                  <MenuItem value="Perro">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PetsIcon fontSize="small" /> Perro
                    </Box>
                  </MenuItem>
                  <MenuItem value="Gato">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PetsIcon fontSize="small" /> Gato
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Sexo</InputLabel>
                <Select
                  name="sexo"
                  value={formData.sexo}
                  onChange={(e) => setFormData(prev => ({ ...prev, sexo: e.target.value }))}
                  label="Sexo"
                >
                  <MenuItem value="Hembra">Hembra</MenuItem>
                  <MenuItem value="Macho">Macho</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Tamaño ahora ocupa su propia columna y es fullWidth y consistente */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel>Tamaño</InputLabel>
                <Select
                  name="tamaño"
                  value={formData.tamaño}
                  onChange={(e) => setFormData(prev => ({ ...prev, tamaño: e.target.value }))}
                  label="Tamaño"
                >
                  <MenuItem value="Pequeño">Pequeño</MenuItem>
                  <MenuItem value="Mediano">Mediano</MenuItem>
                  <MenuItem value="Grande">Grande</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* -------- Fila 2: Raza | Fecha de Nacimiento -------- */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Raza o Tipo"
                name="raza"
                value={formData.raza}
                onChange={(e) => setFormData(prev => ({ ...prev, raza: e.target.value }))}
                helperText="Ej: Labrador, Siames, Mestizo..."
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { minHeight: 56 } }}
              />
            </Grid>

            <Grid item xs={12} md={7}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                helperText="Para calcular su edad y necesidades específicas"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CakeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { minHeight: 56 } }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              Elige un avatar que se parezca a tu mascota
            </Typography>
            {formData.especie ? (
              <Grid container spacing={2} justifyContent="center">
                {getAvatarOptions().map(avatar => (
                  <Grid item key={avatar.id}>
                    <Box
                      onClick={() => setFormData(prev => ({ ...prev, avatar: avatar.src }))}
                      sx={{
                        cursor: 'pointer',
                        border: formData.avatar === avatar.src ? '3px solid' : '2px solid',
                        borderColor: formData.avatar === avatar.src ? 'primary.main' : 'grey.300',
                        borderRadius: 3,
                        p: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Avatar 
                        src={avatar.src} 
                        sx={{ 
                          width: 80, 
                          height: 80,
                          mx: 'auto'
                        }} 
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                Primero selecciona la especie de tu mascota en el paso anterior
              </Alert>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Esta información nos ayuda a recomendar la mejor alimentación para tu compañero
            </Typography>

            {/* ==== ALERGIAS 4–3 ==== */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Alergias o Intolerancias
              </Typography>

              <Grid container spacing={2}>
                {/* Columna izquierda = 4 opciones */}
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    {FORM_OPTIONS.alergias.slice(0, 4).map(option => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={formData.alergias.includes(option)}
                            onChange={(e) => handleCheckboxChange("alergias", option, e.target.checked)}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                {/* Columna derecha = resto (3 opciones) */}
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    {FORM_OPTIONS.alergias.slice(4).map(option => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={formData.alergias.includes(option)}
                            onChange={(e) => handleCheckboxChange("alergias", option, e.target.checked)}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ==== OBJETIVO NUTRICIONAL 4–4 ==== */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Objetivo Nutricional
              </Typography>

              <Grid container spacing={2}>
                {/* Columna izquierda (4 opciones) */}
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    {FORM_OPTIONS.objetivos.slice(0, 4).map(option => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={formData.objetivo.includes(option)}
                            onChange={(e) => handleCheckboxChange("objetivo", option, e.target.checked)}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                {/* Columna derecha (4 opciones) */}
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    {FORM_OPTIONS.objetivos.slice(4).map(option => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={formData.objetivo.includes(option)}
                            onChange={(e) => handleCheckboxChange("objetivo", option, e.target.checked)}
                          />
                        }
                        label={option}
                      />
                    ))}
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ==== ACTIVIDAD (ahora RadioGroup: selección única) ==== */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Nivel de Actividad
              </Typography>

              <RadioGroup
                row={!isMobile}
                value={formData.actividad}
                onChange={(e) => setFormData(prev => ({ ...prev, actividad: e.target.value }))}
              >
                {FORM_OPTIONS.nivelesActividad.map(option => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Cargando tus mascotas...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <PetsIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h4" gutterBottom color="text.secondary">
          Inicia sesión para gestionar tus mascotas
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Accede a tu cuenta para ver y administrar el perfil de tus compañeros peludos
        </Typography>
        <Button component={Link} to="/login" variant="contained" size="large" sx={{ px: 4 }}>
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Alertas */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: '#3d210a', mb: 1 }}>
            Mis Mascotas
          </Typography>
          <Typography variant="h6" color="#fff.secondary">
            Gestiona el perfil de tus compañeros peludos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(45deg, #A8B5A0, #8FA68E)',
            '&:hover': {
              background: 'linear-gradient(45deg, #8FA68E, #7A957A)'
            }
          }}
        >
          Nueva Mascota
        </Button>
      </Box>

      {/* Lista de Mascotas */}
      {mascotas.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            textAlign: 'center', 
            py: 8, 
            px: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}
        >
          <PetsIcon sx={{ fontSize: 80, color: 'grey.400', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
            ¡Aún no tienes mascotas registradas!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
            Registra a tu primera mascota para comenzar a recibir recomendaciones personalizadas de alimentación y cuidado.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3
            }}
          >
            Registrar Primera Mascota
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {mascotas.map((mascota) => (
            <Grid item key={mascota.mascotaID} xs={12} sm={6} lg={4}>
              <Card
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fffaf0', // ← fondo siempre blanco pastel
    border: '1px solid rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    boxShadow: 1,

    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 4
    }
  }}
>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Avatar 
                    src={mascota.avatar} 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 3,
                      border: '3px solid',
                      borderColor: 'primary.light'
                    }} 
                  />
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    {mascota.nombre}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
                    <Chip 
                      label={mascota.especie} 
                      color="primary" 
                      size="small" 
                      variant="outlined" 
                    />
                    {mascota.sexo && (
                      <Chip 
                        label={mascota.sexo} 
                        color="secondary" 
                        size="small" 
                        variant="outlined"
                        icon={mascota.sexo === 'Hembra' ? <FemaleIcon /> : <MaleIcon />}
                      />
                    )}
                    {mascota.tamaño && (
                      <Chip 
                        label={mascota.tamaño} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ textAlign: 'left' }}>
                    {mascota.raza && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PetsIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{mascota.raza}</Typography>
                      </Box>
                    )}
                    {mascota.fechaNacimiento && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CakeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {calculateAge(mascota.fechaNacimiento)} • {getAgeRange(mascota.fechaNacimiento)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
                  <Tooltip title="Editar mascota">
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => handleOpen(mascota)}
                      variant="outlined"
                      size="small"
                    >
                      Editar
                    </Button>
                  </Tooltip>
                  <Tooltip title="Eliminar mascota">
                    <IconButton 
                      onClick={() => handleDelete(mascota.mascotaID)} 
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo de mascota */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
          <Typography variant="h5" component="div" fontWeight="bold" color='#ffffffff'>
            {editingMascota ? `Editar ${formData.nombre}` : 'Nueva Mascota'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, color: '#ffffffff' }}>
            {editingMascota ? 'Actualiza la información de tu mascota' : 'Completa el perfil de tu nuevo compañero'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* ahora mostramos siempre el Stepper para permitir editar todas las secciones */}
          <Stepper activeStep={activeStep} sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ p: 3 }}>
            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider', gap: 1 }}>
          
          {/* Botón ATRÁS */}
          {activeStep > 0 && (
            <Button 
              onClick={handleBack} 
              variant="contained"
              sx={{ 
                backgroundColor: '#5D4E37',
                color: 'white',
                borderColor: '#5D4E37',
                '&:hover': { backgroundColor: '#4A3F2D' }
              }}
            >
              Atrás
            </Button>
          )}

          <Box sx={{ flex: 1 }} />

          {/* Botón CANCELAR */}
          <Button 
            onClick={handleClose} 
            variant="contained"
            sx={{
              backgroundColor: '#5D4E37',
              color: 'white',
              borderColor: '#5D4E37',
              '&:hover': { backgroundColor: '#4A3F2D' }
            }}
          >
            Cancelar
          </Button>

          {/* BOTÓN SIGUIENTE o COMPLETAR */}
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              variant="contained"
              sx={{
                backgroundColor: '#5D4E37',
                color: 'white',
                '&:hover': { backgroundColor: '#4A3F2D' }
              }}
            >
              Siguiente
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              size="large"
              sx={{
                backgroundColor: '#5D4E37',
                color: 'white',
                '&:hover': { backgroundColor: '#4A3F2D' }
              }}
            >
              {editingMascota ? 'Actualizar Mascota' : 'Completar Registro'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MascotasPage;
