// Utilidades para presentar el texto de los productos.
// La descripción llega de la API como un bloque con títulos fijos
// ("Perfil del producto:", "Composición funcional:", ...).

const SECTIONS = [
  { key: 'perfil', label: 'Perfil del producto', title: 'Perfil del producto' },
  { key: 'composicion', label: 'Composición funcional', title: 'Composición funcional' },
  { key: 'beneficios', label: 'Beneficios principales', title: 'Beneficios principales' },
  { key: 'recomendado', label: 'Recomendado para', title: 'Recomendado para' },
  { key: 'evitar', label: 'Evitar en', title: 'Precauciones' },
];

/**
 * Separa la descripción en introducción y secciones conocidas.
 * @returns {{ intro: string, sections: { key: string, title: string, body: string }[] }}
 */
export const parseDescripcion = (text) => {
  const source = (text || '').replace(/\r\n/g, '\n');
  const lower = source.toLowerCase();

  const found = SECTIONS.map((section) => ({ ...section, index: lower.indexOf(section.label.toLowerCase()) }))
    .filter((section) => section.index !== -1)
    .sort((a, b) => a.index - b.index);

  if (found.length === 0) return { intro: source.trim(), sections: [] };

  const sections = found
    .map((section, i) => {
      const start = section.index + section.label.length;
      const end = i + 1 < found.length ? found[i + 1].index : source.length;
      const body = source.slice(start, end).replace(/^\s*:\s*/, '').trim();
      return { key: section.key, title: section.title, body };
    })
    .filter((section) => section.body);

  return { intro: source.slice(0, found[0].index).trim(), sections };
};

/** Convierte un cuerpo de texto en párrafos y listas (líneas que empiezan con -, • o *). */
export const toBlocks = (body) => {
  const blocks = [];
  (body || '').split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    const bullet = line.match(/^[-•*]\s*(.+)$/);
    const last = blocks[blocks.length - 1];
    if (bullet) {
      if (last?.type === 'list') last.items.push(bullet[1]);
      else blocks.push({ type: 'list', items: [bullet[1]] });
    } else {
      blocks.push({ type: 'paragraph', text: line });
    }
  });
  return blocks;
};

/** "Galletas Yacon Light (Calabaza, Yacón y Pollo)" -> título y detalle de ingredientes. */
export const splitNombre = (nombre) => {
  const value = (nombre || '').trim();
  const match = value.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return match ? { titulo: match[1], detalle: match[2] } : { titulo: value, detalle: '' };
};

/** Texto corto para tarjetas: primera frase del perfil o del texto libre. */
export const resumen = (descripcion, max = 110) => {
  const { intro, sections } = parseDescripcion(descripcion);
  const base = (sections.find((s) => s.key === 'perfil')?.body || intro || '').replace(/\s+/g, ' ').trim();
  if (base.length <= max) return base;
  const cut = base.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 40))}…`;
};

export const LOW_STOCK = 10;

/** Estado de inventario para mostrar al cliente. */
export const stockStatus = (stock) => {
  if (!stock || stock <= 0) return { key: 'out', label: 'Agotado', tone: 'danger' };
  if (stock < LOW_STOCK) return { key: 'low', label: 'Últimas unidades', tone: 'warning' };
  return { key: 'ok', label: 'Disponible', tone: 'success' };
};
