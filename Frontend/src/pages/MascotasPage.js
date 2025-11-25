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
  Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import mascotaService from '../services/mascotaService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Avatares (gato/perro)
const catAvatars = [
  { id: 'cat1', src: 'https://images.vexels.com/media/users/3/154255/isolated/preview/9afaf910583333c167e40ee094e12cfa-avatar-animal-gato.png', alt: 'Gato Animado 1' },
  { id: 'cat2', src: 'https://images.vexels.com/media/users/3/155407/isolated/preview/84d636131360b843e427a4ff7061ae0a-gato-rayado-avatar.png', alt: 'Gato Animado 2' },
  { id: 'cat3', src: 'https://images.vexels.com/media/users/3/154703/isolated/preview/ba8ca6661d159486337e8b3b6da0ae7b-avatar-de-gato-mascota.png', alt: 'Gato Animado 3' },
];

const dogAvatars = [
  { id: 'dog1', src: 'https://images.vexels.com/media/users/3/144137/isolated/preview/ca748806d79d3d8d5721d3eb1e663672-ilustracion-de-rottweiler.png', alt: 'Perro Animado 1' },
  { id: 'dog2', src: 'https://images.vexels.com/media/users/3/144928/isolated/lists/ebbccaf76f41f7d83e45a42974cfcd87-ilustracion-de-perro.png', alt: 'Perro Animado 2' },
  { id: 'dog3', src: 'https://images.vexels.com/media/users/3/144116/isolated/preview/a0ade422aae6024947c80e14507b4b15-ilustracion-de-mucuchies.png', alt: 'Perro Animado 3' },
];

const MascotasPage = () => {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingMascota, setEditingMascota] = useState(null);

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
      const data = await mascotaService.getMascotas();
      setMascotas(data);
    } catch (error) {
      console.error('Error fetching mascotas:', error);
    } finally {
      setLoading(false);
    }
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
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMascota(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      } else {
        await mascotaService.createMascota(mascotaPayload);
      }
      fetchMascotas();
      handleClose();
    } catch (error) {
      console.error('Error saving mascota:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      try {
        await mascotaService.deleteMascota(id);
        fetchMascotas();
      } catch (error) {
        console.error('Error deleting mascota:', error);
      }
    }
  };

  const getAvatarOptions = () => {
    return formData.especie === 'Gato' ? catAvatars : dogAvatars;
  };

  const getAgeRange = (age) => {
    if (age >= 0 && age <= 1) return 'Cachorro';
    if (age > 1 && age <= 3) return 'Joven Adulto';
    if (age > 3 && age <= 6) return 'Adulto';
    if (age > 6) return 'Senior';
    return '';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Inicia sesión para gestionar tus mascotas
        </Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#886137' }}>
          Mis Mascotas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ backgroundColor: '#A8B5A0', '&:hover': { backgroundColor: '#8FA68E' } }}
        >
          Agregar Mascota
        </Button>
      </Box>

      {mascotas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#886137' }}>No tienes mascotas registradas</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            ¡Registra a tu primera mascota para comenzar!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ backgroundColor: '#A8B5A0', '&:hover': { backgroundColor: '#8FA68E' } }}
          >
            Agregar Mascota
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {mascotas.map((mascota) => (
            <Grid item key={mascota.mascotaID} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Avatar src={mascota.avatar} sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>{mascota.nombre}</Typography>
                  <Chip label={mascota.especie} color="primary" size="small" sx={{ mb: 1 }} />
                  {mascota.raza && <Typography variant="body2">Raza: {mascota.raza}</Typography>}
                  {mascota.fechaNacimiento && (
                    <Typography variant="body2">
                      Edad: {(() => {
                        const age = new Date().getFullYear() - new Date(mascota.fechaNacimiento).getFullYear();
                        const range = getAgeRange(age);
                        return `${age} años (${range})`;
                      })()}
                    </Typography>
                  )}
                  {mascota.tamaño && <Typography variant="body2">Tamaño: {mascota.tamaño}</Typography>}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Tooltip title="Editar mascota">
                    <IconButton onClick={() => handleOpen(mascota)} color="primary"><EditIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar mascota">
                    <IconButton onClick={() => handleDelete(mascota.mascotaID)} color="error"><DeleteIcon /></IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialogo de alta/edición */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ color: '#886137' }}>{editingMascota ? 'Editar Mascota' : 'Agregar Nueva Mascota'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Datos básicos */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </Grid>

              {/* 🔹 Especie, Sexo, Tamaño en fila */}
              <Grid item xs={4}>
                <FormControl fullWidth required>
                  <InputLabel>Especie</InputLabel>
                  <Select
                    name="especie"
                    value={formData.especie}
                    onChange={(e) => setFormData(prev => ({ ...prev, especie: e.target.value }))}
                    label="Especie"
                  >
                    <MenuItem value="Perro">Perro</MenuItem>
                    <MenuItem value="Gato">Gato</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
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

              <Grid item xs={4}>
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

              {/* Avatares - siempre visible */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Selecciona un Avatar</Typography>
                {formData.especie ? (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {getAvatarOptions().map(avatar => (
                      <Box
                        key={avatar.id}
                        onClick={() => setFormData(prev => ({ ...prev, avatar: avatar.src }))}
                        sx={{
                          cursor: 'pointer',
                          border: formData.avatar === avatar.src ? '3px solid #A8B5A0' : '1px solid #ddd',
                          borderRadius: 2,
                          p: 1,
                          '&:hover': { borderColor: '#A8B5A0' }
                        }}
                      >
                        <Avatar src={avatar.src} sx={{ width: 60, height: 60 }} />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Selecciona una especie para ver los avatares disponibles.
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Raza"
                  name="raza"
                  value={formData.raza}
                  onChange={(e) => setFormData(prev => ({ ...prev, raza: e.target.value }))}
                />
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
                />
              </Grid>

              {/* Notas adicionales con checkboxes */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Notas Adicionales</Typography>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle1">Alergias o Intolerancias</Typography>
                  <FormGroup>
                    {['Pollo', 'Cereales', 'Soya', 'Papas o legumbres'].map(option => (
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

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Objetivo Nutricional</Typography>
                  <FormGroup row>
                    {[
                      'Control de peso',
                      'Aumento de energía o masa muscular',
                      'Digestión sensible',
                      'Piel y pelaje saludables',
                      'Soporte articular o movilidad',
                      'Soporte inmunológico',
                      'Vitalidad y longevidad',
                    ].map(option => (
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

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Nivel de Actividad</Typography>
                  <FormGroup row>
                    {['Sedentario', 'Moderadamente activo', 'Muy activo'].map(option => (
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
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#A8B5A0', '&:hover': { backgroundColor: '#8FA68E' } }}
          >
            {editingMascota ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MascotasPage;
