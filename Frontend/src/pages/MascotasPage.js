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
  useMediaQuery
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
    { id: 'cat4', src: 'https://cdn-icons-png.flaticon.com/512/2204/2204714.png', alt: 'Gato Animado 4' },
  ],
  Perro: [
    { id: 'dog1', src: 'https://images.vexels.com/media/users/3/144137/isolated/preview/ca748806d79d3d8d5721d3eb1e663672-ilustracion-de-rottweiler.png', alt: 'Perro Animado 1' },
    { id: 'dog2', src: 'https://images.vexels.com/media/users/3/144928/isolated/lists/ebbccaf76f41f7d83e45a42974cfcd87-ilustracion-de-perro.png', alt: 'Perro Animado 2' },
    { id: 'dog3', src: 'https://images.vexels.com/media/users/3/144116/isolated/preview/a0ade422aae6024947c80e14507b4b15-ilustracion-de-mucuchies.png', alt: 'Perro Animado 3' },
    { id: 'dog4', src: 'https://cdn-icons-png.flaticon.com/512/6205/6205827.png', alt: 'Perro Animado 4' },
  ]
};

// Opciones predefinidas para formularios
const FORM_OPTIONS = {
  alergias: ['Pollo', 'Cereales', 'Soya', 'Papa', 'Camote', 'Legumbres', 'Aceites', 'Vegetales'],
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
    } catch (error) {
      console.error('Error fetching mascotas:', error);
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
      const notas = mascota.notasAdicionales || '';

      const getSection = (label) => {
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
        alergias: getSection('Alergias'),
        objetivo: getSection('Objetivo nutricional'),
        actividad: (notas.match(/Nivel de actividad:([^|]+)/i)?.[1]?.trim()) || ''
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
      setActiveStep(0);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMascota(null);
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCheckboxChange = (field, option) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
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
Nivel de actividad: ${formData.actividad || 'No especificado'}
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
      fetchMascotas();
      handleClose();
    } catch (error) {
      console.error('Error saving mascota:', error);
      showMessage('Error al guardar la mascota. Por favor, intenta nuevamente.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.')) {
      try {
        await mascotaService.deleteMascota(id);
        showMessage('Mascota eliminada exitosamente');
        fetchMascotas();
      } catch (error) {
        console.error('Error deleting mascota:', error);
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre de tu mascota"
                name="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
                helperText="Cómo llamas a tu compañero peludo"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Especie</InputLabel>
                <Select
                  name="especie"
                  value={formData.especie}
                  onChange={(e) => setFormData(prev => ({ ...prev, especie: e.target.value, avatar: '' }))}
                  label="Especie"
                >
                  <MenuItem value="Perro">🐕 Perro</MenuItem>
                  <MenuItem value="Gato">🐈 Gato</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sexo</InputLabel>
                <Select
                  name="sexo"
                  value={formData.sexo}
                  onChange={(e) => setFormData(prev => ({ ...prev, sexo: e.target.value }))}
                  label="Sexo"
                >
                  <MenuItem value="Hembra">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FemaleIcon fontSize="small" /> Hembra
                    </Box>
                  </MenuItem>
                  <MenuItem value="Macho">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MaleIcon fontSize="small" /> Macho
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Raza"
                name="raza"
                value={formData.raza}
                onChange={(e) => setFormData(prev => ({ ...prev, raza: e.target.value }))}
                helperText="Ej: Labrador, Siames, Mestizo..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                helperText="Para calcular su edad y necesidades específicas"
              />
              {formData.fechaNacimiento && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  {calculateAge(formData.fechaNacimiento)} • {getAgeRange(formData.fechaNacimiento)}
                </Typography>
              )}
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
            <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
              Esta información nos ayuda a recomendar la mejor alimentación para tu compañero
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Alergias o Intolerancias
              </Typography>
              <FormGroup row={!isMobile}>
                {FORM_OPTIONS.alergias.map(option => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={formData.alergias.includes(option)}
                        onChange={() => handleCheckboxChange('alergias', option)}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Objetivo Nutricional
              </Typography>
              <FormGroup row={!isMobile}>
                {FORM_OPTIONS.objetivos.map(option => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={formData.objetivo.includes(option)}
                        onChange={() => handleCheckboxChange('objetivo', option)}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Nivel de Actividad
              </Typography>
              <FormGroup row={!isMobile}>
                {FORM_OPTIONS.nivelesActividad.map(option => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={formData.actividad === option}
                        onChange={() => setFormData(prev => ({ ...prev, actividad: option }))}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
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
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: 'primary.main', mb: 1 }}>
            Mis Mascotas
          </Typography>
          <Typography variant="h6" color="text.secondary">
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
                  transition: 'all 0.3s ease',
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
          <Typography variant="h5" component="div" fontWeight="bold">
            {editingMascota ? `Editar ${formData.nombre}` : 'Nueva Mascota'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {editingMascota ? 'Actualiza la información de tu mascota' : 'Completa el perfil de tu nuevo compañero'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {!editingMascota && (
            <Stepper activeStep={activeStep} sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          
          <Box sx={{ p: 3 }}>
            {renderStepContent(editingMascota ? 0 : activeStep)}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider', gap: 1 }}>
          {!editingMascota && activeStep > 0 && (
            <Button onClick={handleBack} variant="outlined">
              Atrás
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          {!editingMascota && activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} variant="contained">
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} variant="contained" size="large">
              {editingMascota ? 'Actualizar Mascota' : 'Completar Registro'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MascotasPage;