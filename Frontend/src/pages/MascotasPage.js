import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import mascotaService from '../services/mascotaService';
import { useToast } from '../context/ToastContext';
import { errorMessage } from '../config/api';
import { buildNotas, calculateAge, getAgeRange, parseNotas } from '../lib/pets';
import { color, ease, radius, shadow } from '../theme/tokens';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { PawPrint } from '../components/ui/PawPrint';
import PetFormDialog from '../components/pets/PetFormDialog';
import { openCoco } from '../components/chat/Chatbot';

const Tag = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: { bg: color.sunken, fg: color.inkSoft },
    olive: { bg: color.olive[100], fg: color.olive[700] },
    danger: { bg: color.danger.tint, fg: color.danger.main },
  };
  return (
    <Box component="li" sx={{ px: 1.25, py: 0.4, borderRadius: `${radius.xs}px`, bgcolor: tones[tone].bg, color: tones[tone].fg, fontSize: '0.8125rem', fontWeight: 600 }}>
      {children}
    </Box>
  );
};

const PetCard = ({ mascota, onEdit, onDelete }) => {
  const notas = parseNotas(mascota.notasAdicionales);
  const edad = calculateAge(mascota.fechaNacimiento);
  const etapa = getAgeRange(mascota.fechaNacimiento);
  const facts = [mascota.especie, mascota.sexo, mascota.tamaño].filter(Boolean).join(' · ');
  const hasProfile = notas.alergias.length > 0 || notas.objetivos.length > 0 || notas.nivelActividad;

  return (
    <Box
      component="article"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        borderRadius: `${radius.lg}px`,
        bgcolor: color.surface,
        border: `1px solid ${color.line}`,
        transition: `box-shadow 300ms ${ease.css.out}, transform 300ms ${ease.css.out}`,
        '@media (hover: hover)': { '&:hover': { boxShadow: shadow.md, transform: 'translateY(-3px)' } },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={mascota.avatar || undefined} alt="" variant="rounded" sx={{ width: 76, height: 76, borderRadius: '26px 26px 26px 8px', bgcolor: color.olive[100], color: color.olive[600], '& img': { objectFit: 'contain', p: 0.75 } }}>
          <PawPrint size={34} />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h3" component="h2" noWrap>
            {mascota.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {facts}
          </Typography>
        </Box>
      </Box>

      <Box component="dl" sx={{ m: 0, mt: 2.5, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 2, rowGap: 0.75, fontSize: '0.9375rem' }}>
        {mascota.raza && (
          <>
            <Box component="dt" sx={{ color: color.inkMuted }}>
              Raza
            </Box>
            <Box component="dd" sx={{ m: 0, fontWeight: 600 }}>
              {mascota.raza}
            </Box>
          </>
        )}
        {edad && (
          <>
            <Box component="dt" sx={{ color: color.inkMuted }}>
              Edad
            </Box>
            <Box component="dd" sx={{ m: 0, fontWeight: 600 }}>
              {edad}
              {etapa ? ` (${etapa.toLowerCase()})` : ''}
            </Box>
          </>
        )}
        {notas.nivelActividad && (
          <>
            <Box component="dt" sx={{ color: color.inkMuted }}>
              Actividad
            </Box>
            <Box component="dd" sx={{ m: 0, fontWeight: 600 }}>
              {notas.nivelActividad}
            </Box>
          </>
        )}
      </Box>

      {(notas.alergias.length > 0 || notas.objetivos.length > 0) && (
        <Box component="ul" aria-label="Alergias y objetivos" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {notas.alergias.map((item) => (
            <Tag key={`a-${item}`} tone="danger">
              Sin {item.toLowerCase()}
            </Tag>
          ))}
          {notas.objetivos.map((item) => (
            <Tag key={`o-${item}`} tone="olive">
              {item.replace(/\s*\([^)]*\)/, '')}
            </Tag>
          ))}
        </Box>
      )}

      {!hasProfile && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Completa su perfil de salud para que Coco pueda recomendarle snacks.
        </Typography>
      )}

      <Box sx={{ mt: 'auto', pt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button onClick={openCoco} variant="outlined" size="small" sx={{ mr: 'auto' }}>
          Pedir recomendación
        </Button>
        <Tooltip title="Editar">
          <IconButton onClick={() => onEdit(mascota)} aria-label={`Editar a ${mascota.nombre}`} sx={{ width: 44, height: 44 }}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton onClick={() => onDelete(mascota)} aria-label={`Eliminar a ${mascota.nombre}`} sx={{ width: 44, height: 44, '&:hover': { color: color.danger.main, bgcolor: color.danger.tint } }}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const MascotasPage = () => {
  const { notify } = useToast();
  const [mascotas, setMascotas] = useState([]);
  const [status, setStatus] = useState('loading');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setStatus('loading');
    try {
      setMascotas(await mascotaService.getMascotas());
      setStatus('ready');
    } catch {
      if (!silent) setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openForm = (mascota = null) => {
    setEditing(mascota);
    setFormOpen(true);
  };

  const handleSubmit = async (form) => {
    // Los campos opcionales vacíos viajan como null para que el backend no rechace la fecha.
    const payload = {
      nombre: form.nombre.trim(),
      especie: form.especie,
      sexo: form.sexo || null,
      raza: form.raza.trim() || null,
      fechaNacimiento: form.fechaNacimiento || null,
      tamaño: form.tamaño || null,
      avatar: form.avatar || null,
      notasAdicionales: buildNotas(form),
    };

    setSaving(true);
    try {
      if (editing) {
        await mascotaService.updateMascota(editing.mascotaID, payload);
        notify(`Actualizamos el perfil de ${payload.nombre}.`);
      } else {
        await mascotaService.createMascota(payload);
        notify(`${payload.nombre} ya tiene su perfil.`);
      }
      setFormOpen(false);
      await load(true);
    } catch (error) {
      notify(errorMessage(error, 'No pudimos guardar los datos. Inténtalo nuevamente.'), { severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await mascotaService.deleteMascota(toDelete.mascotaID);
      notify(`Eliminamos el perfil de ${toDelete.nombre}.`, { severity: 'info' });
      setConfirmOpen(false);
      await load(true);
    } catch (error) {
      notify(errorMessage(error, 'No pudimos eliminar el perfil.'), { severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  // El nombre se conserva mientras el diálogo se cierra, para que el título no cambie a mitad de la animación.
  const askDelete = (mascota) => {
    setToDelete(mascota);
    setConfirmOpen(true);
  };

  const addButton = (
    <Button onClick={() => openForm()} variant="contained" startIcon={<AddRoundedIcon />}>
      Agregar mascota
    </Button>
  );

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
      {status === 'error' && (
        <EmptyState
          title="No pudimos cargar tus mascotas"
          description="Revisa tu conexión e inténtalo otra vez."
          action={
            <Button onClick={() => load()} variant="contained" startIcon={<RefreshRoundedIcon />}>
              Reintentar
            </Button>
          }
        />
      )}

      {status === 'ready' && mascotas.length === 0 && (
        <EmptyState
          title="Preséntanos a tu mascota"
          description="Con su edad, alergias y objetivos, Coco puede recomendarte los snacks que mejor le van."
          action={
            <Button onClick={() => openForm()} variant="contained" size="large" startIcon={<AddRoundedIcon />}>
              Registrar mi primera mascota
            </Button>
          }
        />
      )}

      {(status === 'loading' || (status === 'ready' && mascotas.length > 0)) && (
        <>
          <PageHeader
            crumbs={[{ label: 'Inicio', to: '/' }]}
            current="Mis mascotas"
            eyebrow="Tu cuenta"
            title="Mis mascotas"
            description="Su perfil es la base de las recomendaciones de Coco. Mantenlo al día."
            actions={addButton}
          />
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}>
            {status === 'loading' && [0, 1].map((i) => <Skeleton key={i} variant="rounded" height={300} sx={{ borderRadius: `${radius.lg}px` }} />)}
            <AnimatePresence mode="popLayout">
              {status === 'ready' &&
                mascotas.map((mascota, index) => (
                  <motion.div
                    key={mascota.mascotaID}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: index * 0.06, ease: ease.out } }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
                    style={{ height: '100%' }}
                  >
                    <PetCard mascota={mascota} onEdit={openForm} onDelete={askDelete} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </Box>
        </>
      )}

      <PetFormDialog open={formOpen} mascota={editing} saving={saving} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Eliminar a ${toDelete?.nombre || 'tu mascota'}?`}
        description="Se borrará su perfil y Coco dejará de usarlo para recomendar. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </Container>
  );
};

export default MascotasPage;
