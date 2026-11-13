// Cálculos del reporte de ventas a partir de los pedidos que entrega la API.
// Todo se deriva en el navegador: no requiere endpoints adicionales.

import { hasReceipt } from './orders';

const DAY = 24 * 60 * 60 * 1000;

/** Lunes 00:00 de la semana de `date` (hora local). */
export const startOfWeek = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};

/** Cifras generales. "Ventas" cuenta solo pedidos pagados (o ya enviados/entregados). */
export const resumen = (pedidos) => {
  const pagados = pedidos.filter((p) => hasReceipt(p.estadoPedido));
  const pendientes = pedidos.filter((p) => p.estadoPedido === 'Pendiente');
  const cancelados = pedidos.filter((p) => p.estadoPedido === 'Cancelado');
  const ingresos = pagados.reduce((sum, p) => sum + p.totalPedido, 0);
  return {
    ingresos,
    pedidosPagados: pagados.length,
    ticketPromedio: pagados.length ? ingresos / pagados.length : 0,
    porCobrar: pendientes.reduce((sum, p) => sum + p.totalPedido, 0),
    pedidosPendientes: pendientes.length,
    tasaCancelacion: pedidos.length ? cancelados.length / pedidos.length : 0,
    totalPedidos: pedidos.length,
  };
};

/** Ventas pagadas por semana, de la más antigua a la actual. */
export const ventasPorSemana = (pedidos, semanas = 8, hoy = new Date()) => {
  const actual = startOfWeek(hoy).getTime();
  const buckets = Array.from({ length: semanas }, (_, i) => ({ inicio: new Date(actual - (semanas - 1 - i) * 7 * DAY), total: 0, pedidos: 0 }));
  pedidos
    .filter((p) => hasReceipt(p.estadoPedido))
    .forEach((p) => {
      const semana = startOfWeek(p.fechaPedido).getTime();
      // Math.round absorbe el desfase de una hora en cambios de horario.
      const index = semanas - 1 - Math.round((actual - semana) / (7 * DAY));
      if (index >= 0 && index < semanas) {
        buckets[index].total += p.totalPedido;
        buckets[index].pedidos += 1;
      }
    });
  return buckets;
};

/** Productos con más unidades vendidas en pedidos pagados. */
export const productosMasVendidos = (pedidos, limite = 5) => {
  const porProducto = new Map();
  pedidos
    .filter((p) => hasReceipt(p.estadoPedido))
    .forEach((p) =>
      (p.detalles || []).forEach((d) => {
        const actual = porProducto.get(d.productoID) || { productoID: d.productoID, nombre: d.nombreProducto, unidades: 0, ingresos: 0 };
        actual.unidades += d.cantidad;
        actual.ingresos += d.cantidad * d.precioUnitario;
        porProducto.set(d.productoID, actual);
      })
    );
  return [...porProducto.values()].sort((a, b) => b.unidades - a.unidades || b.ingresos - a.ingresos).slice(0, limite);
};

/** Cantidad de pedidos por estado, en el orden indicado. */
export const pedidosPorEstado = (pedidos, orden = ['Pagado', 'Pendiente', 'Cancelado', 'Enviado', 'Entregado']) => {
  const conteo = {};
  pedidos.forEach((p) => {
    conteo[p.estadoPedido] = (conteo[p.estadoPedido] || 0) + 1;
  });
  const estados = [...orden, ...Object.keys(conteo).filter((estado) => !orden.includes(estado))];
  return estados.filter((estado) => conteo[estado]).map((estado) => ({ estado, cantidad: conteo[estado] }));
};
