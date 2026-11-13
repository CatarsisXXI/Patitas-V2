// Motor de recomendaciones de Coco. Reglas definidas por el negocio:
// las alergias excluyen productos; objetivos, actividad y edad acotan la lista.

import { parseNotas } from './pets';

const CAROB = 'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)';
const YACON = 'Galletas Yacon Light (Calabaza, Yacón y Pollo)';
const OMEGA = 'Vital Omega Crunch (Harina de Linaza y Zapallo)';
const DERMO = 'Galletas Dermosalud (Aceite de Oliva y Plátano)';
const DIGEST = 'Bocaditos Digest Fit (Plátano y Cúrcuma)';

export const ALL_PRODUCTS = [CAROB, YACON, OMEGA, DERMO, DIGEST];

export const RULES = {
  // Productos a excluir por alergia.
  alergias: {
    Pollo: [CAROB, YACON],
    Cereales: [OMEGA, DERMO, DIGEST],
    Camote: [CAROB],
    'Aceite vegetal': [DERMO, OMEGA],
  },
  // Productos indicados por objetivo nutricional.
  objetivos: {
    'Control de peso': [DERMO, YACON],
    'Aumento de energía o masa muscular': [YACON, CAROB],
    'Apoyo Digestivo': [DIGEST, CAROB, YACON],
    'Piel y pelaje saludables': [DERMO, DIGEST, OMEGA],
    'Soporte articular o movilidad': [YACON, CAROB, OMEGA],
    'Soporte inmunológico': [CAROB, DIGEST, YACON],
    'Vitalidad y longevidad': [DIGEST, OMEGA],
    'Control del nivel de azúcar': [YACON],
  },
  // Una lista vacía significa "sin restricción".
  nivelActividad: {
    Sedentario: [DIGEST, YACON, OMEGA],
    'Moderadamente activo': [],
    'Muy activo': [YACON, CAROB],
  },
  edad: {
    Cachorro: [],
    'Joven Adulto': [],
    Adulto: [],
    Senior: [DIGEST, YACON, OMEGA],
  },
};

/** Quita la aclaración entre paréntesis: "Apoyo Digestivo (digestión sensible)" -> "Apoyo Digestivo". */
const stripDetail = (value) => value.replace(/\([^)]*\)/g, '').trim();

export const normalizeText = (text) =>
  (text ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Devuelve los nombres de producto recomendados para un perfil.
 * @param {{ alergias?: string[], objetivos?: string[], nivelActividad?: string, edad?: string }} perfil
 */
export const recomendar = ({ alergias = [], objetivos = [], nivelActividad = '', edad = '' } = {}) => {
  const excluidos = new Set(alergias.flatMap((alergia) => RULES.alergias[alergia] || []));
  let candidatos = ALL_PRODUCTS.filter((producto) => !excluidos.has(producto));
  if (candidatos.length === 0) return [];

  // Los objetivos solo acotan si alguno de sus productos sigue disponible tras las alergias.
  const porObjetivo = new Set(
    objetivos.flatMap((objetivo) => RULES.objetivos[stripDetail(objetivo)] || []).filter((p) => candidatos.includes(p))
  );
  if (porObjetivo.size > 0) candidatos = [...porObjetivo];

  const porActividad = RULES.nivelActividad[nivelActividad] || [];
  if (porActividad.length > 0) candidatos = candidatos.filter((p) => porActividad.includes(p));

  const porEdad = RULES.edad[edad] || [];
  if (porEdad.length > 0) candidatos = candidatos.filter((p) => porEdad.includes(p));

  return candidatos;
};

/** Perfil de recomendación a partir de una mascota tal como la devuelve la API. */
export const perfilDeMascota = (mascota) => parseNotas(mascota?.notasAdicionales ?? mascota?.notas_adicionales ?? '');

/** Empareja los nombres recomendados con los productos reales del catálogo. */
export const emparejarProductos = (nombres, catalogo = []) =>
  nombres.map(
    (nombre) => catalogo.find((p) => normalizeText(p.nombre) === normalizeText(nombre)) || { nombre, sinCatalogo: true }
  );
