import { buildNotas, calculateAge, getAgeRange, parseNotas } from './pets';

const HOY = new Date('2026-11-12T12:00:00');

describe('calculateAge', () => {
  it('expresa la edad en meses cuando aún no cumple un año', () => {
    expect(calculateAge('2026-03-10', HOY)).toBe('8 meses');
    expect(calculateAge('2026-10-10', HOY)).toBe('1 mes');
  });

  it('combina años y meses', () => {
    expect(calculateAge('2021-11-01', HOY)).toBe('5 años');
    expect(calculateAge('2024-07-01', HOY)).toBe('2 años y 4 meses');
    expect(calculateAge('2025-10-01', HOY)).toBe('1 año y 1 mes');
  });

  it('devuelve null sin fecha válida o con fecha futura', () => {
    expect(calculateAge('', HOY)).toBeNull();
    expect(calculateAge('no-es-fecha', HOY)).toBeNull();
    expect(calculateAge('2030-01-01', HOY)).toBeNull();
  });
});

describe('getAgeRange', () => {
  it.each([
    ['2026-01-01', 'Cachorro'],
    ['2025-06-01', 'Cachorro'],
    ['2023-06-01', 'Joven Adulto'],
    ['2021-06-01', 'Adulto'],
    ['2016-06-01', 'Senior'],
  ])('%s -> %s', (fecha, etapa) => {
    expect(getAgeRange(fecha, HOY)).toBe(etapa);
  });

  it('devuelve cadena vacía sin fecha', () => {
    expect(getAgeRange('', HOY)).toBe('');
  });
});

describe('notas de la mascota', () => {
  it('serializa el perfil en el formato que guarda la API', () => {
    const notas = buildNotas({ alergias: ['Pollo', 'Camote'], objetivo: ['Control de peso'], actividad: 'Muy activo', fechaNacimiento: '' });
    expect(notas).toBe('Alergias: Pollo, Camote | Objetivo nutricional: Control de peso | Nivel de actividad: Muy activo | Edad: No especificado');
  });

  it('usa los textos por defecto cuando faltan datos', () => {
    expect(buildNotas({})).toBe('Alergias: Ninguna | Objetivo nutricional: No especificado | Nivel de actividad: No especificado | Edad: No especificado');
  });

  it('recupera lo que serializó', () => {
    const form = { alergias: ['Pollo'], objetivo: ['Apoyo Digestivo (digestión sensible)', 'Vitalidad y longevidad'], actividad: 'Sedentario', fechaNacimiento: '' };
    expect(parseNotas(buildNotas(form))).toEqual({ alergias: ['Pollo'], objetivos: form.objetivo, nivelActividad: 'Sedentario', edad: '' });
  });

  it('lee el formato antiguo con saltos de línea y descarta los valores vacíos', () => {
    const antiguo = 'Alergias: Ninguna | \nObjetivo nutricional: No especificado | \nNivel de actividad: Moderadamente activo |\nEdad: Senior';
    expect(parseNotas(antiguo)).toEqual({ alergias: [], objetivos: [], nivelActividad: 'Moderadamente activo', edad: 'Senior' });
  });

  it('tolera notas vacías o con otro contenido', () => {
    const vacio = { alergias: [], objetivos: [], nivelActividad: '', edad: '' };
    expect(parseNotas(null)).toEqual(vacio);
    expect(parseNotas('texto libre sin formato')).toEqual(vacio);
  });
});
