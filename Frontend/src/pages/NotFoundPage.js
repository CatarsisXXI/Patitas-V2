import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

const NotFoundPage = () => (
  <EmptyState
    title="Esta página se nos escapó"
    description="El enlace no existe o cambió de lugar. Puedes volver al inicio o seguir viendo el catálogo."
    action={
      <Button component={Link} to="/" variant="contained">
        Ir al inicio
      </Button>
    }
    secondaryAction={
      <Button component={Link} to="/productos" variant="outlined">
        Ver catálogo
      </Button>
    }
  />
);

export default NotFoundPage;
