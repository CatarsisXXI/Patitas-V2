import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Al cambiar de ruta vuelve al inicio de la página (o al ancla, si la URL trae #id). */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
