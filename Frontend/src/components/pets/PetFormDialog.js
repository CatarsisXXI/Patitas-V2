import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Dialog, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ChoiceChips from '../ui/ChoiceChips';
import { PawPrint } from '../ui/PawPrint';
import { PET_OPTIONS, getAgeRange, parseNotas } from '../../lib/pets';
import { color, ease, radius } from '../../theme/tokens';

// Ilustraciones disponibles como avatar. Se guarda la URL en el perfil de la mascota.
export const PET_AVATARS = {
  Gato: [
    'https://images.vexels.com/media/users/3/154255/isolated/preview/9afaf910583333c167e40ee094e12cfa-avatar-animal-gato.png',
    'https://images.vexels.com/media/users/3/155407/isolated/preview/84d636131360b843e427a4ff7061ae0a-gato-rayado-avatar.png',
    'https://images.vexels.com/media/users/3/154703/isolated/preview/ba8ca6661d159486337e8b3b6da0ae7b-avatar-de-gato-mascota.png',
    'https://images.vexels.com/media/users/3/155373/isolated/preview/0fc6a08bcea7d5dabd97ec5b156a3155-avatar-de-gato-sonoliento.png',
  ],
  Perro: [
    'https://images.vexels.com/media/users/3/144137/isolated/preview/ca748806d79d3d8d5721d3eb1e663672-ilustracion-de-rottweiler.png',
    'https://images.vexels.com/media/users/3/144928/isolated/lists/ebbccaf76f41f7d83e45a42974cfcd87-ilustracion-de-perro.png',
    'https://images.vexels.com/media/users/3/144116/isolated/preview/a0ade422aae6024947c80e14507b4b15-ilustracion-de-mucuchies.png',
    'https://images.vexels.com/media/users/3/144094/isolated/preview/e1aa7540a5644884d9275b6e95b5c254-ilustracion-de-pastor-aleman.png',
  ],
};

const STEPS = ['Datos básicos', 'Avatar', 'Salud y hábitos'];

const EMPTY = { nombre: '', especie: '', sexo: '', raza: '', fechaNacimiento: '', tamaño: '', avatar: '', alergias: [], objetivo: [], actividad: '' };

const fromMascota = (mascota) => {
  if (!mascota) return EMPTY;
  const notas = parseNotas(mascota.notasAdicionales);
  return {
    nombre: mascota.nombre || '',
    especie: mascota.especie || '',
    sexo: mascota.sexo || '',
    raza: mascota.raza || '',
    fechaNacimiento: mascota.fechaNacimiento ? mascota.fechaNacimiento.split('T')[0] : '',
    tamaño: mascota.tamaño || '',
    avatar: mascota.avatar || '',
    alergias: notas.alergias,
    objetivo: notas.objetivos,
    actividad: notas.nivelActividad,
  };
};

const Field = ({ label, hint, children }) => (
  <Box>
    <Typography component="p" sx={{ fontWeight: 650, fontSize: '0.9375rem', mb: hint ? 0.25 : 1 }}>
      {label}
    </Typography>
    {hint && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
        {hint}
      </Typography>
    )}
    {children}
  </Box>
);

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -36 }),
};

/** Formulario por pasos para crear o editar una mascota. */
const PetFormDialog = ({ open, mascota, saving, onClose, onSubmit }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState(EMPTY);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(fromMascota(mascota));
      setStep(0);
      setDirection(1);
      setShowErrors(false);
    }
  }, [open, mascota]);

  const set = (name) => (value) => setForm((prev) => ({ ...prev, [name]: value }));
  const editing = !!mascota;
  const basicsValid = form.nombre.trim() && form.especie;
  const today = new Date().toISOString().split('T')[0];
  const etapa = getAgeRange(form.fechaNacimiento);

  const go = (next) => {
    if (next > step && step === 0 && !basicsValid) {
      setShowErrors(true);
      return;
    }
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleSubmit = () => {
    if (!basicsValid) {
      setShowErrors(true);
      setDirection(-1);
      setStep(0);
      return;
    }
    onSubmit(form);
  };

  const avatars = PET_AVATARS[form.especie] || [];

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth fullScreen={fullScreen} aria-labelledby="mascota-titulo">
      <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: { xs: 2.5, sm: 3.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="overline" component="p" sx={{ color: color.olive[600] }}>
              Paso {step + 1} de {STEPS.length} · {STEPS[step]}
            </Typography>
            <Typography id="mascota-titulo" variant="h3" component="h2" sx={{ mt: 0.5 }}>
              {editing ? `Editar a ${mascota.nombre}` : 'Nueva mascota'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={saving} aria-label="Cerrar" sx={{ width: 44, height: 44, mr: -1, mt: -0.5 }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Progreso del formulario" sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 0.75 }}>
          {STEPS.map((label, index) => (
            <Box key={label} sx={{ height: 4, borderRadius: 2, bgcolor: color.line, overflow: 'hidden' }}>
              <Box component={motion.div} initial={false} animate={{ scaleX: index <= step ? 1 : 0 }} transition={{ duration: 0.4, ease: ease.out }} sx={{ height: '100%', bgcolor: color.olive[600], transformOrigin: 'left' }} />
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3.5, flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: { sm: 420 } }}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div key={step} custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.24, ease: ease.out }}>
            {step === 0 && (
              <Box sx={{ display: 'grid', gap: 3 }}>
                <TextField
                  label="Nombre"
                  value={form.nombre}
                  onChange={(event) => set('nombre')(event.target.value)}
                  required
                  fullWidth
                  autoFocus={!fullScreen}
                  error={showErrors && !form.nombre.trim()}
                  helperText={showErrors && !form.nombre.trim() ? 'Escribe el nombre de tu mascota.' : ''}
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />
                <Field label="Especie">
                  <ChoiceChips label="Especie" options={PET_OPTIONS.especies} value={form.especie} onChange={(value) => setForm((prev) => ({ ...prev, especie: value, avatar: PET_AVATARS[value]?.includes(prev.avatar) ? prev.avatar : editing && value === mascota.especie ? prev.avatar : '' }))} />
                  {showErrors && !form.especie && (
                    <Typography variant="body2" role="alert" sx={{ mt: 1, color: color.danger.main }}>
                      Elige si es perro o gato.
                    </Typography>
                  )}
                </Field>
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <Field label="Sexo">
                    <ChoiceChips label="Sexo" options={PET_OPTIONS.sexos} value={form.sexo} onChange={set('sexo')} />
                  </Field>
                  <Field label="Tamaño">
                    <ChoiceChips label="Tamaño" options={PET_OPTIONS.tamanos} value={form.tamaño} onChange={set('tamaño')} />
                  </Field>
                </Box>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <TextField label="Raza o tipo" value={form.raza} onChange={(event) => set('raza')(event.target.value)} fullWidth helperText="Por ejemplo: labrador, siamés, mestizo." slotProps={{ htmlInput: { maxLength: 100 } }} />
                  <TextField
                    label="Fecha de nacimiento"
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={(event) => set('fechaNacimiento')(event.target.value)}
                    fullWidth
                    helperText={etapa ? `Etapa de vida: ${etapa}.` : 'Sirve para calcular su etapa de vida.'}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
                  />
                </Box>
              </Box>
            )}

            {step === 1 && (
              <Field label="Elige un avatar" hint="Es opcional. Puedes cambiarlo cuando quieras.">
                {avatars.length === 0 ? (
                  <Typography color="text.secondary">Vuelve al paso anterior y elige la especie para ver los avatares.</Typography>
                ) : (
                  <Box role="radiogroup" aria-label="Avatar" sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' } }}>
                    {avatars.map((src, index) => {
                      const selected = form.avatar === src;
                      return (
                        <Box
                          key={src}
                          component="button"
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          aria-label={`Avatar ${index + 1}`}
                          onClick={() => set('avatar')(selected ? '' : src)}
                          sx={{
                            p: 1.5,
                            aspectRatio: '1',
                            border: '2px solid',
                            borderColor: selected ? color.olive[600] : color.line,
                            borderRadius: `${radius.lg}px`,
                            bgcolor: selected ? color.olive[100] : color.surface,
                            cursor: 'pointer',
                            transition: 'border-color 160ms ease, background-color 160ms ease, transform 200ms cubic-bezier(0.23, 1, 0.32, 1)',
                            '&:hover': { transform: 'translateY(-3px)', borderColor: selected ? color.olive[600] : color.lineStrong },
                          }}
                        >
                          <Avatar src={src} alt="" variant="rounded" sx={{ width: '100%', height: '100%', bgcolor: 'transparent', color: color.inkMuted }}>
                            <PawPrint size={36} />
                          </Avatar>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Field>
            )}

            {step === 2 && (
              <Box sx={{ display: 'grid', gap: 3.5 }}>
                <Field label="Alergias o intolerancias" hint="Coco descartará los snacks que contengan estos ingredientes.">
                  <ChoiceChips label="Alergias o intolerancias" multiple size="small" options={PET_OPTIONS.alergias} value={form.alergias} onChange={set('alergias')} />
                </Field>
                <Field label="Objetivo nutricional" hint="Puedes marcar más de uno.">
                  <ChoiceChips label="Objetivo nutricional" multiple size="small" options={PET_OPTIONS.objetivos} value={form.objetivo} onChange={set('objetivo')} />
                </Field>
                <Field label="Nivel de actividad">
                  <ChoiceChips label="Nivel de actividad" size="small" options={PET_OPTIONS.nivelesActividad} value={form.actividad} onChange={set('actividad')} />
                </Field>
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 2.5, sm: 4 }, py: 2.5, borderTop: `1px solid ${color.line}` }}>
        {step > 0 && (
          <Button onClick={() => go(step - 1)} disabled={saving} variant="text" startIcon={<ArrowBackRoundedIcon />}>
            Atrás
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        {step < STEPS.length - 1 ? (
          <Button onClick={() => go(step + 1)} variant="contained" endIcon={<ArrowForwardRoundedIcon />}>
            Siguiente
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={saving} variant="contained" startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}>
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Registrar mascota'}
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default PetFormDialog;
