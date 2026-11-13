import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Skeleton } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import pedidoService from '../services/pedidoService';
import { color, radius, shadow } from '../theme/tokens';
import EmptyState from '../components/ui/EmptyState';
import Receipt from '../components/orders/Receipt';

const BoletaPage = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [status, setStatus] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    pedidoService
      .getPedidoById(id)
      .then((data) => {
        if (cancelled) return;
        setPedido(data);
        setStatus('ready');
      })
      .catch((error) => !cancelled && setStatus([403, 404].includes(error.response?.status) ? 'missing' : 'error'));
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  if (status === 'missing' || status === 'error') {
    return (
      <EmptyState
        title={status === 'missing' ? 'No encontramos esta boleta' : 'No pudimos cargar la boleta'}
        description={status === 'missing' ? 'Puede que el enlace sea incorrecto o que el pedido pertenezca a otra cuenta.' : 'Revisa tu conexión e inténtalo otra vez.'}
        action={
          status === 'error' ? (
            <Button onClick={() => setAttempt((n) => n + 1)} variant="contained" startIcon={<RefreshRoundedIcon />}>
              Reintentar
            </Button>
          ) : (
            <Button component={Link} to="/mis-compras" variant="contained">
              Ver mis compras
            </Button>
          )
        }
      />
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 }, '@media print': { pt: 0, maxWidth: '100% !important' } }}>
      <Box className="no-print" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 1.5, mb: 3 }}>
        <Button component={Link} to="/mis-boletas" variant="text" startIcon={<ArrowBackRoundedIcon />} sx={{ ml: -1 }}>
          Mis boletas
        </Button>
        <Button onClick={() => window.print()} variant="contained" startIcon={<PrintOutlinedIcon />} disabled={status !== 'ready'}>
          Imprimir o guardar PDF
        </Button>
      </Box>

      <Box sx={{ borderRadius: `${radius.lg}px`, overflow: 'hidden', border: `1px solid ${color.line}`, boxShadow: shadow.md, '@media print': { border: 0, boxShadow: 'none', borderRadius: 0 } }}>
        {status === 'loading' ? (
          <Box sx={{ bgcolor: color.white, p: { xs: 3, sm: 6 } }}>
            <Skeleton height={64} width="60%" />
            <Skeleton height={28} sx={{ mt: 4 }} />
            <Skeleton height={28} />
            <Skeleton height={28} />
            <Skeleton height={48} width={240} sx={{ mt: 4, ml: 'auto' }} />
          </Box>
        ) : (
          <Receipt pedido={pedido} />
        )}
      </Box>
    </Container>
  );
};

export default BoletaPage;
