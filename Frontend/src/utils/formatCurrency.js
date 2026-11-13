const formatter = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });

/** Formatea un monto en soles: 18.9 -> "S/ 18.90". */
export const formatCurrency = (amount) => {
  const value = typeof amount === 'number' ? amount : Number(amount);
  return formatter.format(Number.isFinite(value) ? value : 0);
};

const dateFormatter = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const shortDateFormatter = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });

/** Fecha compacta para listas: "11 nov 2026". */
export const formatShortDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : shortDateFormatter.format(date).replace(/\./g, '');
};

export const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
};

export const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateTimeFormatter.format(date).replace(/\./g, '');
};
