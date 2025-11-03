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
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import mascotaService from '../services/mascotaService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Avatar options for cats and dogs
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
    avatar: ''
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
      console.error("Error fetching mascotas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (mascota = null) => {
    if (mascota) {
      setEditingMascota(mascota);
      setFormData({
        nombre: mascota.nombre,
        especie: mascota.especie,
        sexo: mascota.sexo || '',
        raza: mascota.raza || '',
        fechaNacimiento: mascota.fechaNacimiento ? mascota.fechaNacimiento.split('T')[0] : '',
        tamaño: mascota.tamaño || '',
        notasAdicionales: mascota.notasAdicionales || '',
        avatar: mascota.avatar || ''
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
        avatar: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMascota(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarSrc) => {
    setFormData(prev => ({ ...prev, avatar: avatarSrc }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMascota) {
        await mascotaService.updateMascota(editingMascota.mascotaID, formData);
      } else {
        await mascotaService.createMascota(formData);
      }
      fetchMascotas();
      handleClose();
    } catch (error) {
      console.error("Error saving mascota:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      try {
        await mascotaService.deleteMascota(id);
        fetchMascotas();
      } catch (error) {
        console.error("Error deleting mascota:", error);
      }
    }
  };

  const getAvatarOptions = () => {
    return formData.especie === 'Gato' ? catAvatars : dogAvatars;
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
        <Typography variant="h4" gutterBottom>Inicia sesión para gestionar tus mascotas</Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
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
          <Typography variant="h5" gutterBottom>No tienes mascotas registradas</Typography>
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
                  <Avatar
                    src={mascota.avatar}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>{mascota.nombre}</Typography>
                  <Chip label={mascota.especie} color="primary" size="small" sx={{ mb: 1 }} />
                  {mascota.raza && <Typography variant="body2">Raza: {mascota.raza}</Typography>}
                  {mascota.fechaNacimiento && (
                    <Typography variant="body2">
                      Edad: {new Date().getFullYear() - new Date(mascota.fechaNacimiento).getFullYear()} años
                    </Typography>
                  )}
                  {mascota.tamaño && <Typography variant="body2">Tamaño: {mascota.tamaño}</Typography>}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <IconButton onClick={() => handleOpen(mascota)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(mascota.mascotaID)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for Add/Edit Mascota */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingMascota ? 'Editar Mascota' : 'Agregar Nueva Mascota'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={{ minWidth: 120 }}>
                  <InputLabel>Especie</InputLabel>
                  <Select
                    name="especie"
                    value={formData.especie}
                    onChange={handleChange}
                    label="Especie"
                  >
                    <MenuItem value="Perro">Perro</MenuItem>
                    <MenuItem value="Gato">Gato</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    label="Sexo"
                  >
                    <MenuItem value="Hembra">Hembra</MenuItem>
                    <MenuItem value="Macho">Macho</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Raza"
                  name="raza"
                  value={formData.raza}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel>Tamaño</InputLabel>
                  <Select
                    name="tamaño"
                    value={formData.tamaño}
                    onChange={handleChange}
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
                  label="Notas Adicionales"
                  name="notasAdicionales"
                  value={formData.notasAdicionales}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              {formData.especie && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Selecciona un Avatar</Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {getAvatarOptions().map((avatar) => (
                      <Box
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.src)}
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
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#A8B5A0', '&:hover': { backgroundColor: '#8FA68E' } }}>
            {editingMascota ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MascotasPage;