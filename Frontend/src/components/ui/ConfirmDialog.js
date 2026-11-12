import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

/**
 * Confirmación para acciones destructivas.
 * Con `requireText`, el botón solo se habilita al escribir esa palabra exacta.
 */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
  requireText,
  loading = false,
  onConfirm,
  onClose,
}) => {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (open) setTyped('');
  }, [open]);

  const blocked = !!requireText && typed.trim() !== requireText;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth aria-labelledby="confirm-title">
      <DialogTitle id="confirm-title" sx={{ pt: 3, pb: 1, fontSize: '1.25rem', fontWeight: 650 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        {description && <Typography color="text.secondary">{description}</Typography>}
        {requireText && (
          <TextField
            autoFocus
            fullWidth
            size="small"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            label={`Escribe ${requireText} para confirmar`}
            sx={{ mt: 2.5 }}
            inputProps={{ autoComplete: 'off', spellCheck: false }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} variant="text">
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading || blocked}
          variant="contained"
          color={tone === 'danger' ? 'error' : 'primary'}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
