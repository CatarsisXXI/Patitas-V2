import { ALL_PRODUCTS, emparejarProductos, perfilDeMascota, recomendar } from './recommendations';

const [CAROB, YACON, OMEGA, DERMO, DIGEST] = ALL_PRODUCTS;

describe('recomendar', () => {
  it('sin restricciones devuelve todo el catálogo', () => {
    expect(recomendar()).toEqual(ALL_PRODUCTS);
  });

  it('excluye los productos con ingredientes a los que es alérgica', () => {
    const resultado = recomendar({ alergias: ['Pollo'] });
    expect(resultado).not.toContain(CAROB);
    expect(resultado).not.toContain(YACON);
    expect(resultado).toEqual([OMEGA, DERMO, DIGEST]);
  });

  it('devuelve lista vacía si las alergias descartan todo', () => {
    expect(recomendar({ alergias: ['Pollo', 'Cereales'] })).toEqual([]);
  });

  it('acota por objetivo respetando las alergias', () => {
    expect(recomendar({ alergias: ['Pollo'], objetivos: ['Piel y pelaje saludables'] })).toEqual([DERMO, DIGEST, OMEGA]);
  });

  it('entiende el objetivo aunque traiga la aclaración entre paréntesis', () => {
    expect(recomendar({ objetivos: ['Apoyo Digestivo (digestión sensible)'] })).toEqual([DIGEST, CAROB, YACON]);
  });

  it('ignora un objetivo cuyos productos quedaron descartados por alergia', () => {
    // "Control del nivel de azúcar" solo recomienda Yacon, que lleva pollo.
    expect(recomendar({ alergias: ['Pollo'], objetivos: ['Control del nivel de azúcar'] })).toEqual([OMEGA, DERMO, DIGEST]);
  });

  it('aplica actividad y edad como filtros adicionales', () => {
    expect(recomendar({ nivelActividad: 'Muy activo' })).toEqual([CAROB, YACON]);
    expect(recomendar({ edad: 'Senior' })).toEqual([YACON, OMEGA, DIGEST]);
    expect(recomendar({ nivelActividad: 'Muy activo', edad: 'Senior' })).toEqual([YACON]);
  });

  it('no restringe con actividad moderada ni con etapas sin regla', () => {
    expect(recomendar({ nivelActividad: 'Moderadamente activo', edad: 'Adulto' })).toEqual(ALL_PRODUCTS);
  });
});

describe('perfilDeMascota', () => {
  it('lee el perfil desde las notas de la mascota', () => {
    const mascota = { notasAdicionales: 'Alergias: Pollo | Objetivo nutricional: Control de peso | Nivel de actividad: Sedentario | Edad: Senior' };
    expect(perfilDeMascota(mascota)).toEqual({ alergias: ['Pollo'], objetivos: ['Control de peso'], nivelActividad: 'Sedentario', edad: 'Senior' });
  });
});

describe('emparejarProductos', () => {
  const catalogo = [
    { productoID: 7, nombre: 'Bocaditos Digest Fit (Plátano y Cúrcuma)', precio: 18.9 },
    { productoID: 9, nombre: 'GALLETAS DERMOSALUD (aceite de oliva y platano)', precio: 21.5 },
  ];

  it('encuentra el producto del catálogo sin importar tildes ni mayúsculas', () => {
    expect(emparejarProductos([DIGEST, DERMO], catalogo).map((p) => p.productoID)).toEqual([7, 9]);
  });

  it('marca los que no están en el catálogo', () => {
    expect(emparejarProductos([OMEGA], catalogo)).toEqual([{ nombre: OMEGA, sinCatalogo: true }]);
  });
});
