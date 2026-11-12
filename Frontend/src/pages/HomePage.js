import React, { useCallback, useEffect, useMemo, useState } from 'react';
import productService from '../services/productService';
import Hero from './home/Hero';
import IngredientMarquee from './home/IngredientMarquee';
import FeaturedProducts from './home/FeaturedProducts';
import Values from './home/Values';
import CocoBand from './home/CocoBand';
import About from './home/About';
import Quotes from './home/Quotes';
import FinalCta from './home/FinalCta';

const FEATURED_COUNT = 4;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    let cancelled = false;
    setStatus('loading');
    productService
      .getProductos()
      .then((data) => {
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : []);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [load]);

  // Primero los que tienen stock; así la portada nunca destaca un agotado si hay alternativa.
  const featured = useMemo(() => [...products].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0)).slice(0, FEATURED_COUNT), [products]);

  return (
    <>
      <Hero product={featured.find((p) => p.stock > 0 && p.imagenURL)} />
      <IngredientMarquee />
      <FeaturedProducts products={featured} status={status} onRetry={load} />
      <Values />
      <CocoBand />
      <About />
      <Quotes />
      <FinalCta />
    </>
  );
};

export default HomePage;
