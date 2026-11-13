// Datos del negocio usados en toda la interfaz (footer, boletas, WhatsApp).
// Edita este archivo para actualizar la información pública de la tienda.

export const site = {
  name: 'Patitas y Sabores',
  tagline: 'Amor natural',
  whatsapp: '51956550376',
  social: [
    { name: 'Instagram', url: 'https://instagram.com/patitasySabores' },
    { name: 'Facebook', url: 'https://facebook.com/patitasySabores' },
    { name: 'TikTok', url: 'https://tiktok.com/@patitasySabores' },
  ],
  // Datos fiscales que se imprimen en la boleta. Reemplázalos por los reales antes de publicar.
  legal: {
    ruc: '20123456789',
    address: 'Calle Ficticia 123, Lima, Perú',
    phone: '(01) 123-4567',
    receiptSeries: 'B001',
  },
};

export const whatsappUrl = (text) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
