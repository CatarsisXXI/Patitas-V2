import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PetsIcon from '@mui/icons-material/Pets';

const WelcomeModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
          boxShadow: '0 20px 60px rgba(93, 78, 55, 0.2)',
          border: '2px solid rgba(212, 165, 116, 0.3)'
        }
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 1,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <PetsIcon sx={{ fontSize: 40, color: '#D4A574', mr: 1 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#5D4E37',
              fontSize: '1.8rem'
            }}
          >
            ¡Bienvenido a Patitas y Sabores!
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#7D6B5D',
            '&:hover': {
              color: '#5D4E37'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', px: 4, pb: 3 }}>
        <Typography
          variant="body1"
          sx={{
            color: '#5D4E37',
            lineHeight: 1.6,
            fontSize: '1.1rem',
            mb: 2
          }}
        >
          Somos una página dedicada a ofrecer los mejores productos para tus mascotas.
          Aquí puedes disfrutar de nuestro chatbot inteligente llamado <strong>COCO</strong>,
          que te ayudará con recomendaciones y consejos personalizados.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#7D6B5D',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}
        >
          Para utilizar COCO, asegúrate de estar registrado como cliente y haber registrado
          al menos una mascota en tu perfil.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '25px',
            background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 50%, #8A7B5D 100%)',
            color: '#FFFFFF',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(212, 165, 116, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(212, 165, 116, 0.4)',
              background: 'linear-gradient(135deg, #B8955D 0%, #8A9683 50%, #6B5D4A 100%)'
            }
          }}
        >
          ¡Entendido!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeModal;
