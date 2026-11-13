import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Box, Button, IconButton, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { color, radius, shadow, z } from '../theme/tokens';

const ToastContext = createContext({ notify: () => {} });

const ICONS = {
  success: <CheckCircleRoundedIcon fontSize="small" sx={{ color: color.olive[300] }} />,
  error: <ErrorOutlineRoundedIcon fontSize="small" sx={{ color: color.onInk.error }} />,
  info: <InfoOutlinedIcon fontSize="small" sx={{ color: color.onInk.info }} />,
};

/**
 * Notificaciones breves de la app.
 * Uso: const { notify } = useToast(); notify('Guardado', { severity: 'success', action: { label, onClick } })
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const notify = useCallback((message, options = {}) => {
    setToast({ id: Date.now(), message, severity: 'success', duration: 4000, ...options });
    setOpen(true);
  }, []);

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.id}
        open={open}
        onClose={handleClose}
        autoHideDuration={toast?.duration}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'left' }}
        sx={{ zIndex: z.toast }}
      >
        <Box
          role={toast?.severity === 'error' ? 'alert' : 'status'}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            pl: 2,
            pr: 0.75,
            py: 0.75,
            minHeight: 48,
            maxWidth: 440,
            bgcolor: color.ink,
            color: color.paper,
            borderRadius: `${radius.md}px`,
            boxShadow: shadow.lg,
            fontSize: '0.9375rem',
            fontWeight: 500,
          }}
        >
          {ICONS[toast?.severity] || ICONS.info}
          <Box sx={{ flex: 1, py: 0.5 }}>{toast?.message}</Box>
          {toast?.action && (
            <Button
              size="small"
              onClick={() => {
                toast.action.onClick();
                setOpen(false);
              }}
              sx={{ color: color.olive[300], fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
            >
              {toast.action.label}
            </Button>
          )}
          <IconButton
            size="small"
            aria-label="Cerrar aviso"
            onClick={() => setOpen(false)}
            sx={{ color: 'rgba(246,242,231,0.7)', '&:hover': { color: color.paper, bgcolor: 'rgba(255,255,255,0.08)' } }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
