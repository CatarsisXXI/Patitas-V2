import { parseDescripcion, resumen, splitNombre, stockStatus, toBlocks } from './productCopy';

const FICHA = `Perfil del producto:
Bocaditos horneados con plátano.
Composición funcional:
- Plátano: fibra
- Cúrcuma: curcumina
Beneficios principales:
- Digestión regular
Recomendado para:
Perros adultos.
Evitar en:
Alergia a cereales.`;

describe('parseDescripcion', () => {
  it('separa la ficha en sus secciones, en orden', () => {
    const { intro, sections } = parseDescripcion(FICHA);
    expect(intro).toBe('');
    expect(sections.map((s) => s.key)).toEqual(['perfil', 'composicion', 'beneficios', 'recomendado', 'evitar']);
    expect(sections[0].body).toBe('Bocaditos horneados con plátano.');
    expect(sections[4]).toEqual({ key: 'evitar', title: 'Precauciones', body: 'Alergia a cereales.' });
  });

  it('funciona con la ficha en una sola línea', () => {
    const { sections } = parseDescripcion('Perfil del producto: Suave. Evitar en: Cachorros.');
    expect(sections).toEqual([
      { key: 'perfil', title: 'Perfil del producto', body: 'Suave.' },
      { key: 'evitar', title: 'Precauciones', body: 'Cachorros.' },
    ]);
  });

  it('trata un texto sin títulos como introducción', () => {
    expect(parseDescripcion('Premios pequeños para entrenar.')).toEqual({ intro: 'Premios pequeños para entrenar.', sections: [] });
    expect(parseDescripcion(undefined)).toEqual({ intro: '', sections: [] });
  });
});

describe('toBlocks', () => {
  it('agrupa las líneas con guion en una lista', () => {
    expect(toBlocks('Intro\n- uno\n- dos\nCierre')).toEqual([
      { type: 'paragraph', text: 'Intro' },
      { type: 'list', items: ['uno', 'dos'] },
      { type: 'paragraph', text: 'Cierre' },
    ]);
  });
});

describe('splitNombre', () => {
  it('separa el nombre comercial de los ingredientes', () => {
    expect(splitNombre('Galletas Yacon Light (Calabaza, Yacón y Pollo)')).toEqual({ titulo: 'Galletas Yacon Light', detalle: 'Calabaza, Yacón y Pollo' });
  });

  it('deja intacto un nombre sin paréntesis', () => {
    expect(splitNombre('Huesos de Pollo')).toEqual({ titulo: 'Huesos de Pollo', detalle: '' });
    expect(splitNombre(undefined)).toEqual({ titulo: '', detalle: '' });
  });
});

describe('resumen', () => {
  it('usa el perfil del producto y lo recorta en una palabra completa', () => {
    expect(resumen(FICHA)).toBe('Bocaditos horneados con plátano.');
    const largo = resumen(`Perfil del producto: ${'palabra '.repeat(40)}`, 60);
    expect(largo.length).toBeLessThanOrEqual(61);
    expect(largo.endsWith('…')).toBe(true);
  });
});

describe('stockStatus', () => {
  it.each([
    [0, 'out'],
    [undefined, 'out'],
    [9, 'low'],
    [10, 'ok'],
    [50, 'ok'],
  ])('stock %s -> %s', (stock, key) => {
    expect(stockStatus(stock).key).toBe(key);
  });
});
