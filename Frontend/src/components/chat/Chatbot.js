import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useAuth } from '../../context/AuthContext';
import mascotaService from '../../services/mascotaService';
import productService from '../../services/productService';
import { assetUrl } from '../../config/api';
import { whatsappUrl } from '../../config/site';
import { formatCurrency } from '../../utils/formatCurrency';
import { splitNombre } from '../../lib/productCopy';
import { emparejarProductos, perfilDeMascota, recomendar } from '../../lib/recommendations';
import { color, ease, radius, shadow, spring, whatsappButtonSx, z } from '../../theme/tokens';
import SmartImage from '../ui/SmartImage';

const OPEN_EVENT = 'pys:abrir-coco';
const NUDGE_KEY = 'pys:bienvenida';
const COCO_AVATAR = '/images/coco.webp';

/** Abre el asistente desde cualquier parte de la app. */
export const openCoco = () => window.dispatchEvent(new Event(OPEN_EVENT));

const MAIN_OPTIONS = [
  { label: 'Recomiéndame un snack', action: 'recomendaciones' },
  { label: 'Ver el catálogo', action: 'productos' },
];

let messageId = 0;
const nextId = () => {
  messageId += 1;
  return messageId;
};

/** Revela el texto por palabras en menos de un segundo; con movimiento reducido aparece completo. */
const TypedText = ({ text, animate }) => {
  const reduce = useReducedMotion();
  const parts = useMemo(() => text.split(/(\s+)/), [text]);
  const [count, setCount] = useState(animate && !reduce ? 0 : parts.length);

  useEffect(() => {
    if (count >= parts.length) return undefined;
    const step = Math.max(2, Math.ceil(parts.length / 26));
    const timer = setTimeout(() => setCount((c) => Math.min(parts.length, c + step)), 24);
    return () => clearTimeout(timer);
  }, [count, parts.length]);

  return (
    <>
      <span aria-hidden="true">{parts.slice(0, count).join('')}</span>
      <span className="visually-hidden">{text}</span>
    </>
  );
};

const TypingDots = () => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 1.5 }}>
    <Avatar src={COCO_AVATAR} alt="" sx={{ width: 28, height: 28 }} />
    <Box role="status" aria-label="Coco está escribiendo" sx={{ display: 'flex', gap: 0.5, px: 1.75, py: 1.5, bgcolor: color.surface, border: `1px solid ${color.line}`, borderRadius: '16px 16px 16px 4px' }}>
      {[0, 1, 2].map((i) => (
        <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color.inkMuted, animation: 'dot-bounce 1.1s ease-in-out infinite', animationDelay: `${i * 0.14}s` }} />
      ))}
    </Box>
  </Box>
);

const ChatProduct = ({ product, onView }) => {
  const { titulo, detalle } = splitNombre(product.nombre);
  const text = `Hola, quiero pedir: ${product.nombre}${product.precio ? ` (${formatCurrency(product.precio)})` : ''}. ¿Me dan más información?`;

  return (
    <Box sx={{ display: 'flex', gap: 1.5, p: 1.25, bgcolor: color.surface, border: `1px solid ${color.line}`, borderRadius: `${radius.md}px` }}>
      <SmartImage src={assetUrl(product.imagenURL)} alt="" fit="contain" blend ratio={1} radius={radius.sm} sx={{ width: 60, flexShrink: 0, alignSelf: 'flex-start' }} imgSx={{ p: 0.5 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
          <Typography sx={{ fontWeight: 650, fontSize: '0.9375rem', lineHeight: 1.3 }}>{titulo}</Typography>
          {product.precio != null && (
            <Typography className="tabular" sx={{ fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
              {formatCurrency(product.precio)}
            </Typography>
          )}
        </Box>
        {detalle && (
          <Typography variant="caption" color="text.secondary" component="p" noWrap>
            {detalle}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
          {product.productoID && (
            <Button size="small" variant="outlined" onClick={() => onView(product)} sx={{ minHeight: 32, px: 1.5 }}>
              Ver
            </Button>
          )}
          <Button
            size="small"
            component="a"
            href={whatsappUrl(text)}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon sx={{ fontSize: '16px !important' }} />}
            sx={{ minHeight: 32, px: 1.5, ...whatsappButtonSx }}
          >
            Pedir
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const Chatbot = () => {
  const { user, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const [products, setProducts] = useState([]);

  const timers = useRef([]);
  const logRef = useRef(null);
  const contentRef = useRef(null);
  const panelRef = useRef(null);
  const fabRef = useRef(null);

  const schedule = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /** Coco responde con uno o varios mensajes encadenados, mostrando "escribiendo" entre ellos. */
  const say = useCallback(
    (steps) => {
      setTyping(true);
      let at = 0;
      steps.forEach((step, index) => {
        at += step.delay ?? 650;
        schedule(() => {
          setMessages((prev) => [...prev, { id: nextId(), from: 'bot', ...step }]);
          if (index === steps.length - 1) setTyping(false);
        }, at);
      });
    },
    [schedule]
  );

  // Datos que Coco necesita: catálogo (público) y mascotas del cliente.
  useEffect(() => {
    if (!open) return;
    productService.getProductos().then(setProducts).catch(() => setProducts([]));
    if (isCustomer) mascotaService.getMascotas().then(setMascotas).catch(() => setMascotas([]));
    else setMascotas([]);
  }, [open, isCustomer]);

  useEffect(() => {
    if (open && messages.length === 0) {
      const saludo = user?.firstName ? `Hola, ${user.firstName}.` : 'Hola.';
      say([
        {
          delay: 350,
          text: `${saludo} Soy Coco, el asistente de Patitas y Sabores. Puedo sugerirte snacks según el perfil de tu mascota o mostrarte el catálogo.`,
          options: MAIN_OPTIONS,
        },
      ]);
    }
  }, [open, messages.length, user, say]);

  // El chat sigue al último mensaje. Además de reaccionar a mensajes nuevos, se
  // observa el alto del contenido: el texto se revela por palabras y las
  // opciones aparecen después, así que la lista crece sin que cambie `messages`.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!open || !contentRef.current || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Aviso de bienvenida: una sola vez por navegador, sin bloquear la página.
  useEffect(() => {
    if (localStorage.getItem(NUDGE_KEY)) return undefined;
    const timer = setTimeout(() => setNudge(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  const dismissNudge = useCallback(() => {
    setNudge(false);
    localStorage.setItem(NUDGE_KEY, '1');
  }, []);

  useEffect(() => {
    if (open) {
      dismissNudge();
      panelRef.current?.focus();
    }
  }, [open, dismissNudge]);

  const close = () => setOpen(false);

  // Escape cierra el chat desde cualquier parte, salvo que haya un diálogo abierto encima.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && !document.querySelector('.MuiModal-root')) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Al cerrar, el foco vuelve al botón que abrió el chat.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!open && wasOpen.current) fabRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const recommendFor = (mascota) => {
    const perfil = perfilDeMascota(mascota);
    const nombres = recomendar(perfil);
    const encontrados = emparejarProductos(nombres, products);
    const criterios = [
      ['Alergias', perfil.alergias.join(', ') || 'Ninguna'],
      ['Objetivos', perfil.objetivos.join(', ') || 'Sin objetivo definido'],
      ['Actividad', perfil.nivelActividad || 'Sin especificar'],
      ['Etapa', perfil.edad || 'Sin especificar'],
    ];

    if (encontrados.length === 0) {
      say([
        { text: `Esto es lo que sé de ${mascota.nombre}:`, criteria: criterios },
        {
          delay: 1100,
          text: `Con esas condiciones no encontré un snack que cumpla todo. Puedes revisar el catálogo completo o ajustar su perfil en Mis mascotas.`,
          options: [
            { label: 'Ver el catálogo', action: 'productos' },
            { label: 'Editar perfil', action: 'ir', value: '/mascotas' },
          ],
        },
      ]);
      return;
    }

    say([
      { text: `Esto es lo que tomé en cuenta para ${mascota.nombre}:`, criteria: criterios },
      {
        delay: 1200,
        text: encontrados.length === 1 ? `Hay una opción que encaja con ${mascota.nombre}:` : `Estas ${encontrados.length} opciones encajan con ${mascota.nombre}:`,
      },
      ...encontrados.map((product) => ({ delay: 420, product })),
      {
        delay: 700,
        text: '¿Te ayudo con algo más?',
        options: [
          { label: 'Otra recomendación', action: 'recomendaciones' },
          { label: 'Ver el catálogo', action: 'productos' },
        ],
      },
    ]);
  };

  const handleRecommendations = () => {
    if (!user) {
      say([
        {
          text: 'Para recomendarte bien necesito conocer a tu mascota: su edad, alergias y objetivos. Crea una cuenta y registra su perfil; toma un par de minutos.',
          options: [
            { label: 'Crear cuenta', action: 'ir', value: '/registro' },
            { label: 'Ya tengo cuenta', action: 'ir', value: '/login' },
            { label: 'Ver el catálogo', action: 'productos' },
          ],
        },
      ]);
      return;
    }
    if (!isCustomer) {
      say([{ text: 'Las recomendaciones usan el perfil de mascotas de una cuenta de cliente.', options: [{ label: 'Ver el catálogo', action: 'productos' }] }]);
      return;
    }
    if (mascotas.length === 0) {
      say([
        {
          text: 'Todavía no registras una mascota. Cuéntame de ella en Mis mascotas y vuelvo con sugerencias a su medida.',
          options: [
            { label: 'Registrar mascota', action: 'ir', value: '/mascotas' },
            { label: 'Ver el catálogo', action: 'productos' },
          ],
        },
      ]);
      return;
    }
    if (mascotas.length > 1) {
      say([
        {
          text: '¿Para quién preparo la recomendación?',
          options: mascotas.map((mascota) => ({ label: `${mascota.nombre} (${mascota.especie})`, action: 'mascota', value: mascota.mascotaID, display: mascota.nombre })),
        },
      ]);
      return;
    }
    recommendFor(mascotas[0]);
  };

  const handleProducts = () => {
    if (products.length === 0) {
      say([{ text: 'Ahora mismo no puedo cargar el catálogo. Inténtalo de nuevo en un momento.', options: MAIN_OPTIONS }]);
      return;
    }
    say([
      { text: 'Este es nuestro catálogo:' },
      ...products.map((product) => ({ delay: 260, product })),
      { delay: 600, text: '¿Quieres que te recomiende uno según tu mascota?', options: [{ label: 'Sí, recomiéndame', action: 'recomendaciones' }] },
    ]);
  };

  const handleOption = (option) => {
    if (typing) return;
    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: option.display || option.label }]);
    // El botón pulsado desaparece; el foco se queda en el panel para seguir con el teclado.
    panelRef.current?.focus();

    switch (option.action) {
      case 'recomendaciones':
        handleRecommendations();
        break;
      case 'productos':
        handleProducts();
        break;
      case 'mascota': {
        const mascota = mascotas.find((m) => String(m.mascotaID) === String(option.value));
        if (mascota) recommendFor(mascota);
        else say([{ text: 'No encontré esa mascota. ¿Probamos otra vez?', options: MAIN_OPTIONS }]);
        break;
      }
      case 'ir':
        setOpen(false);
        navigate(option.value);
        break;
      default:
        say([{ text: '¿En qué te ayudo?', options: MAIN_OPTIONS }]);
    }
  };

  const viewProduct = (product) => {
    navigate(`/productos/${product.productoID}`);
    if (window.matchMedia?.('(max-width: 599.95px)').matches) setOpen(false);
  };

  const lastId = messages[messages.length - 1]?.id;

  return (
    <Box className="no-print" sx={{ position: 'fixed', right: { xs: 12, sm: 24 }, bottom: { xs: 12, sm: 24 }, zIndex: z.chat, pointerEvents: 'none', '& > *': { pointerEvents: 'auto' } }}>
      <AnimatePresence>
        {open && (
          <Box
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-label="Coco, asistente de recomendaciones"
            component={motion.div}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.16, ease: 'easeIn' } }}
            transition={spring.soft}
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: { xs: 'calc(100vw - 24px)', sm: 392 },
              height: { xs: 'min(640px, calc(100dvh - 24px))', sm: 'min(640px, calc(100dvh - 48px))' },
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transformOrigin: 'bottom right',
              bgcolor: color.paper,
              borderRadius: `${radius.lg}px`,
              border: `1px solid ${color.line}`,
              boxShadow: shadow.lg,
              outline: 'none',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, bgcolor: color.olive[900], color: color.paper }}>
              <Avatar src={COCO_AVATAR} alt="" sx={{ width: 42, height: 42, border: '2px solid rgba(246, 242, 231, 0.3)' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>Coco</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(246, 242, 231, 0.72)' }}>
                  Asistente de recomendaciones
                </Typography>
              </Box>
              <IconButton onClick={close} aria-label="Cerrar chat" sx={{ width: 40, height: 40, color: color.paper, '&:hover': { bgcolor: 'rgba(246, 242, 231, 0.12)', color: color.paper } }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <Box ref={logRef} role="log" aria-live="polite" sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2.5, pb: 1, overscrollBehavior: 'contain' }}>
              <div ref={contentRef}>
              {messages.map((message) => {
                const fromUser = message.from === 'user';
                return (
                  <Box
                    key={message.id}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, ease: ease.out }}
                    sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 1.5, flexDirection: fromUser ? 'row-reverse' : 'row' }}
                  >
                    {!fromUser && <Avatar src={COCO_AVATAR} alt="" sx={{ width: 28, height: 28, visibility: message.product ? 'hidden' : 'visible' }} />}
                    <Box sx={{ maxWidth: '84%', minWidth: 0, flex: message.product ? 1 : 'initial' }}>
                      {message.text && (
                        <Box
                          sx={{
                            px: 1.75,
                            py: 1.25,
                            fontSize: '0.9375rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-line',
                            ...(fromUser
                              ? { bgcolor: color.olive[600], color: color.surface, borderRadius: '16px 16px 4px 16px' }
                              : { bgcolor: color.surface, border: `1px solid ${color.line}`, borderRadius: '16px 16px 16px 4px' }),
                          }}
                        >
                          {fromUser ? message.text : <TypedText text={message.text} animate={message.id === lastId} />}
                          {message.criteria && (
                            <Box component="dl" sx={{ m: 0, mt: 1.25, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 1.5, rowGap: 0.5, fontSize: '0.8125rem' }}>
                              {message.criteria.map(([label, value]) => (
                                <React.Fragment key={label}>
                                  <Box component="dt" sx={{ color: color.inkMuted, fontWeight: 600 }}>
                                    {label}
                                  </Box>
                                  <Box component="dd" sx={{ m: 0 }}>
                                    {value}
                                  </Box>
                                </React.Fragment>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                      {message.product && <ChatProduct product={message.product} onView={viewProduct} />}
                      {message.options && message.id === lastId && !typing && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                          {message.options.map((option, index) => (
                            <Button
                              key={option.label}
                              component={motion.button}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.06, duration: 0.25 }}
                              size="small"
                              variant="outlined"
                              onClick={() => handleOption(option)}
                              sx={{ bgcolor: color.surface, borderColor: color.olive[300], color: color.olive[700], '&:hover': { bgcolor: color.olive[50], borderColor: color.olive[600] } }}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}
              {typing && <TypingDots />}
              </div>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, px: 2, py: 1.5, borderTop: `1px solid ${color.line}`, bgcolor: color.surface }}>
              {MAIN_OPTIONS.map((option) => (
                <Button key={option.action} size="small" variant="text" disabled={typing} onClick={() => handleOption(option)} sx={{ flex: 1, bgcolor: color.sunken, '&:hover': { bgcolor: color.olive[100] } }}>
                  {option.action === 'recomendaciones' ? 'Recomendación' : 'Catálogo'}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && nudge && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
            transition={spring.soft}
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 76,
              width: 264,
              p: 2,
              pr: 4.5,
              bgcolor: color.surface,
              border: `1px solid ${color.line}`,
              borderRadius: '18px 18px 4px 18px',
              boxShadow: shadow.md,
              transformOrigin: 'bottom right',
            }}
          >
            <Typography sx={{ fontWeight: 650, fontSize: '0.9375rem', lineHeight: 1.35 }}>¿No sabes cuál elegir?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Coco te sugiere snacks según la edad, alergias y objetivos de tu mascota.
            </Typography>
            <Button size="small" onClick={() => setOpen(true)} sx={{ mt: 1, ml: -1, color: color.olive[700] }}>
              Hablar con Coco
            </Button>
            <IconButton size="small" onClick={dismissNudge} aria-label="Cerrar aviso" sx={{ position: 'absolute', top: 6, right: 6 }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </AnimatePresence>

      {!open && (
        <Box
          ref={fabRef}
          component={motion.button}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir chat con Coco"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={spring.snappy}
          sx={{
            display: 'block',
            width: 60,
            height: 60,
            p: 0,
            border: `3px solid ${color.surface}`,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: 'pointer',
            bgcolor: color.surface,
            boxShadow: shadow.lg,
          }}
        >
          <Box component="img" src={COCO_AVATAR} alt="" width={54} height={54} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      )}
    </Box>
  );
};

export default Chatbot;
