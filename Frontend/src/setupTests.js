// Matchers de jest-dom (toBeInTheDocument, toHaveAttribute, ...).
import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

// jsdom no trae estas APIs del navegador que usan el router y las animaciones.
Object.assign(global, { TextEncoder, TextDecoder });

window.scrollTo = () => {};
window.matchMedia =
  window.matchMedia ||
  ((query) => ({ matches: false, media: query, onchange: null, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false }));

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver || ObserverStub;

// Las animaciones "al entrar en pantalla" dependen de IntersectionObserver.
// En las pruebas todo cuenta como visible desde el primer momento.
class IntersectionObserverStub extends ObserverStub {
  constructor(callback) {
    super();
    this.callback = callback;
  }

  observe(target) {
    this.callback([{ isIntersecting: true, intersectionRatio: 1, target }], this);
  }
}
window.IntersectionObserver = window.IntersectionObserver || IntersectionObserverStub;
global.IntersectionObserver = window.IntersectionObserver;
