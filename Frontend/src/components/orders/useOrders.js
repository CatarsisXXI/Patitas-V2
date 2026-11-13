import { useCallback, useEffect, useState } from 'react';
import pedidoService from '../../services/pedidoService';

/** Pedidos del cliente con estado de carga y reintento. */
export const useOrders = () => {
  const [pedidos, setPedidos] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setPedidos(await pedidoService.getPedidos());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { pedidos, status, reload: load };
};
