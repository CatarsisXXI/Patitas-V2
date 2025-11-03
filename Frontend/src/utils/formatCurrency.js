// /src/utils/formatCurrency.js

/**
 * Formats a number as Peruvian Soles (S/.)
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted currency string, e.g., "S/ 120.50".
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return 'S/ 0.00';
  }
  // Intl.NumberFormat is the modern standard for currency formatting
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount);
};