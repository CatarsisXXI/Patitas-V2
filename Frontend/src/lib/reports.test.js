import { desglosarIgv, hasReceipt, receiptNumber, totalDeDetalles } from './orders';
import { pedidosPorEstado, productosMasVendidos, resumen, startOfWeek, ventasPorSemana } from './reports';

// Jueves 12 de noviembre de 2026; la semana empieza el lunes 9.
const HOY = new Date(2026, 10, 12, 15, 0);
const dia = (offset) => new Date(2026, 10, 12 + offset, 10, 0).toISOString();

const pedidos = [
  { pedidoID: 1, estadoPedido: 'Pagado', totalPedido: 40, fechaPedido: dia(0), detalles: [{ productoID: 1, nombreProducto: 'A', cantidad: 2, precioUnitario: 20 }] },
  { pedidoID: 2, estadoPedido: 'Pagado', totalPedido: 60, fechaPedido: dia(-7), detalles: [{ productoID: 2, nombreProducto: 'B', cantidad: 3, precioUnitario: 20 }] },
  { pedidoID: 3, estadoPedido: 'Pendiente', totalPedido: 25, fechaPedido: dia(-1), detalles: [{ productoID: 1, nombreProducto: 'A', cantidad: 5, precioUnitario: 5 }] },
  { pedidoID: 4, estadoPedido: 'Cancelado', totalPedido: 99, fechaPedido: dia(-2), detalles: [] },
  { pedidoID: 5, estadoPedido: 'Enviado', totalPedido: 20, fechaPedido: dia(-70), detalles: [{ productoID: 1, nombreProducto: 'A', cantidad: 1, precioUnitario: 20 }] },
];

describe('resumen', () => {
  it('cuenta como venta solo lo pagado y separa lo pendiente', () => {
    expect(resumen(pedidos)).toEqual({ ingresos: 120, pedidosPagados: 3, ticketPromedio: 40, porCobrar: 25, pedidosPendientes: 1, tasaCancelacion: 0.2, totalPedidos: 5 });
  });

  it('no divide entre cero cuando no hay pedidos', () => {
    expect(resumen([])).toMatchObject({ ingresos: 0, ticketPromedio: 0, tasaCancelacion: 0 });
  });
});

describe('ventasPorSemana', () => {
  it('ubica cada pedido pagado en su semana y deja fuera lo anterior al rango', () => {
    const semanas = ventasPorSemana(pedidos, 4, HOY);
    expect(semanas).toHaveLength(4);
    expect(semanas.map((s) => s.total)).toEqual([0, 0, 60, 40]);
    expect(semanas.map((s) => s.pedidos)).toEqual([0, 0, 1, 1]);
    expect(semanas[3].inicio.getTime()).toBe(startOfWeek(HOY).getTime());
  });
});

describe('startOfWeek', () => {
  it('devuelve el lunes, también cuando la fecha cae domingo', () => {
    expect(startOfWeek(new Date(2026, 10, 12)).getDate()).toBe(9);
    expect(startOfWeek(new Date(2026, 10, 15)).getDate()).toBe(9);
    expect(startOfWeek(new Date(2026, 10, 9)).getDate()).toBe(9);
  });
});

describe('productosMasVendidos', () => {
  it('suma unidades de pedidos pagados y ordena de mayor a menor', () => {
    expect(productosMasVendidos(pedidos)).toEqual([
      { productoID: 1, nombre: 'A', unidades: 3, ingresos: 60 },
      { productoID: 2, nombre: 'B', unidades: 3, ingresos: 60 },
    ]);
    expect(productosMasVendidos(pedidos, 1)).toHaveLength(1);
  });
});

describe('pedidosPorEstado', () => {
  it('cuenta por estado en un orden fijo y omite los que no tienen pedidos', () => {
    expect(pedidosPorEstado(pedidos)).toEqual([
      { estado: 'Pagado', cantidad: 2 },
      { estado: 'Pendiente', cantidad: 1 },
      { estado: 'Cancelado', cantidad: 1 },
      { estado: 'Enviado', cantidad: 1 },
    ]);
  });
});

describe('utilidades de pedidos', () => {
  it('desglosa el IGV de un total que ya lo incluye', () => {
    const { subtotal, igv, total } = desglosarIgv(118);
    expect(subtotal).toBeCloseTo(100);
    expect(igv).toBeCloseTo(18);
    expect(total).toBe(118);
  });

  it('suma los detalles y numera la boleta', () => {
    expect(totalDeDetalles([{ cantidad: 2, precioUnitario: 21.5 }, { cantidad: 1, precioUnitario: 7 }])).toBe(50);
    expect(receiptNumber('B001', 1038)).toBe('B001-001038');
  });

  it('solo los pedidos pagados o posteriores tienen boleta', () => {
    expect(['Pagado', 'Enviado', 'Entregado'].every(hasReceipt)).toBe(true);
    expect(['Pendiente', 'Cancelado'].some(hasReceipt)).toBe(false);
  });
});
