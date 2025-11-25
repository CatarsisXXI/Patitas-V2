import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Fade,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PetsIcon from '@mui/icons-material/Pets';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const WelcomeModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
          boxShadow: '0 24px 80px rgba(93, 78, 55, 0.25)',
          border: '3px solid rgba(212, 165, 116, 0.4)',
          overflow: 'visible',
          position: 'relative'
        }
      }}
    >
      {/* Decoración de huellita flotante superior */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(212, 165, 116, 0.4)',
          animation: 'bounce 2s ease-in-out infinite'
        }}
      >
        <PetsIcon sx={{ fontSize: 40, color: '#FFFFFF' }} />
      </Box>

      {/* Botón de cerrar mejorado */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          color: '#7D6B5D',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1,
          '&:hover': {
            color: '#5D4E37',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'rotate(90deg)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ textAlign: 'center', px: 4, pt: 6, pb: 4 }}>
        {/* Título principal con gradiente */}
        <Fade in={open} timeout={800}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#5D4E37',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              mb: 1,
              background: 'linear-gradient(135deg, #D4A574 0%, #8A7B5D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ¡Bienvenido a Patitas y Sabores! 🐾
          </Typography>
        </Fade>

        <Fade in={open} timeout={1000}>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#7D6B5D',
              fontSize: '1rem',
              mb: 4,
              fontWeight: 400
            }}
          >
            Tu tienda de confianza para consentir a tu mejor amigo
          </Typography>
        </Fade>

        {/* Características principales con iconos */}
        <Box sx={{ mb: 4 }}>
          {/* Feature 1: Productos Premium */}
          <Fade in={open} timeout={1200}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 3,
                p: 2,
                borderRadius: '16px',
                backgroundColor: 'rgba(212, 165, 116, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(212, 165, 116, 0.12)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#D4A574',
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 48
                }}
              >
                <FavoriteIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
              </Box>
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#5D4E37',
                    fontSize: '1rem',
                    mb: 0.5
                  }}
                >
                  Productos Premium
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#7D6B5D', lineHeight: 1.5 }}
                >
                  Snacks naturales y saludables para tu mascota
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* Feature 2: COCO */}
          <Fade in={open} timeout={1400}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 3,
                p: 2,
                borderRadius: '16px',
                backgroundColor: 'rgba(168, 181, 160, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(168, 181, 160, 0.12)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#A8B5A0',
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 48
                }}
              >
                <SmartToyIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
              </Box>
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#5D4E37',
                    fontSize: '1rem',
                    mb: 0.5
                  }}
                >
                  Conoce a COCO 🤖
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#7D6B5D', lineHeight: 1.5 }}
                >
                  Nuestro asistente virtual te dará recomendaciones personalizadas
                </Typography>
              </Box>
            </Box>
          </Fade>

          {/* Feature 3: Experiencia Personalizada */}
          <Fade in={open} timeout={1600}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                p: 2,
                borderRadius: '16px',
                backgroundColor: 'rgba(138, 123, 93, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(138, 123, 93, 0.12)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#8A7B5D',
                  borderRadius: '12px',
                  p: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 48
                }}
              >
                <VerifiedUserIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
              </Box>
              <Box sx={{ textAlign: 'left', flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#5D4E37',
                    fontSize: '1rem',
                    mb: 0.5
                  }}
                >
                  Experiencia Personalizada
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#7D6B5D', lineHeight: 1.5 }}
                >
                  Regístrate y agrega a tu mascota para aprovechar todas las funciones
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Box>

        {/* Nota con tip */}
        <Fade in={open} timeout={1800}>
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 165, 116, 0.1)',
              border: '1px dashed rgba(212, 165, 116, 0.3)',
              mb: 3
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#5D4E37',
                lineHeight: 1.6,
                fontSize: '0.95rem'
              }}
            >
              💡 <strong>Tip:</strong> Para usar COCO y obtener recomendaciones personalizadas, 
              asegúrate de tener una cuenta y haber registrado a tu mascota.
            </Typography>
          </Box>
        </Fade>

        {/* Botón principal mejorado */}
        <Fade in={open} timeout={2000}>
          <Button
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{
              py: 1.8,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1.1rem',
              boxShadow: '0 8px 24px rgba(212, 165, 116, 0.3)',
              transition: 'all 0.3s ease',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 32px rgba(212, 165, 116, 0.4)',
                background: 'linear-gradient(135deg, #B8955D 0%, #8A9683 100%)'
              }
            }}
          >
            ¡Comenzar a Explorar! 🚀
          </Button>
        </Fade>
      </DialogContent>

      {/* Animación de bounce para el icono superior */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            50% {
              transform: translateX(-50%) translateY(-10px);
            }
          }
        `}
      </style>
    </Dialog>
  );
};

export default WelcomeModal;