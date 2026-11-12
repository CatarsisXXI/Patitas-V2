// Lógica compartida del perfil de mascotas. El backend guarda alergias,
// objetivos, actividad y rango de edad dentro de `notasAdicionales` con el
// formato "Alergias: a, b | Objetivo nutricional: c | Nivel de actividad: d | Edad: e".
// El asistente Coco lee ese mismo texto, así que el formato no debe cambiar.

export const PET_OPTIONS = {
  especies: ['Perro', 'Gato'],
  sexos: ['Hembra', 'Macho'],
  tamanos: ['Pequeño', 'Mediano', 'Grande'],
  alergias: ['Pollo', 'Cereales', 'Soya', 'Papa', 'Camote', 'Legumbres', 'Aceite vegetal'],
  objetivos: [
    'Control de peso',
    'Aumento de energía o masa muscular',
    'Apoyo Digestivo (digestión sensible)',
    'Piel y pelaje saludables',
    'Soporte articular o movilidad',
    'Soporte inmunológico',
    'Vitalidad y longevidad',
    'Control del nivel de azúcar',
  ],
  nivelesActividad: ['Sedentario', 'Moderadamente activo', 'Muy activo'],
};

const NONE = ['ninguna', 'ninguno', 'no especificado', 'no especificada'];
const isNone = (value) => NONE.includes((value || '').trim().toLowerCase());
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Edad legible: "8 meses", "3 años", "2 años y 4 meses". */
export const calculateAge = (fechaNacimiento, today = new Date()) => {
  if (!fechaNacimiento) return null;
  const birth = new Date(fechaNacimiento);
  if (Number.isNaN(birth.getTime())) return null;

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return null;
  if (years === 0) return plural(months, 'mes', 'meses');
  if (months === 0) return plural(years, 'año', 'años');
  return `${plural(years, 'año', 'años')} y ${plural(months, 'mes', 'meses')}`;
};

/** Etapa de vida usada por las recomendaciones. */
export const getAgeRange = (fechaNacimiento, today = new Date()) => {
  if (!fechaNacimiento) return '';
  const birth = new Date(fechaNacimiento);
  if (Number.isNaN(birth.getTime())) return '';
  const years = today.getFullYear() - birth.getFullYear();
  if (years < 0) return '';
  if (years <= 1) return 'Cachorro';
  if (years <= 3) return 'Joven Adulto';
  if (years <= 6) return 'Adulto';
  return 'Senior';
};

/** Serializa el perfil de salud al formato que guarda la API. */
export const buildNotas = ({ alergias = [], objetivo = [], actividad = '', fechaNacimiento = '' }) =>
  [
    `Alergias: ${alergias.length ? alergias.join(', ') : 'Ninguna'}`,
    `Objetivo nutricional: ${objetivo.length ? objetivo.join(', ') : 'No especificado'}`,
    `Nivel de actividad: ${actividad || 'No especificado'}`,
    `Edad: ${getAgeRange(fechaNacimiento) || 'No especificado'}`,
  ].join(' | ');

/** Lee `notasAdicionales` y devuelve los valores tal como aparecen en el formulario. */
export const parseNotas = (notas) => {
  const result = { alergias: [], objetivos: [], nivelActividad: '', edad: '' };
  if (!notas || typeof notas !== 'string') return result;

  const list = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item && !isNone(item));

  notas.split('|').forEach((part) => {
    const separator = part.indexOf(':');
    if (separator === -1) return;
    const label = part.slice(0, separator).trim().toLowerCase();
    const value = part.slice(separator + 1).trim();

    if (label === 'alergias') result.alergias = list(value);
    else if (label === 'objetivo nutricional') result.objetivos = list(value);
    else if (label === 'nivel de actividad') result.nivelActividad = isNone(value) ? '' : value;
    else if (label === 'edad') result.edad = isNone(value) ? '' : value;
  });

  return result;
};
