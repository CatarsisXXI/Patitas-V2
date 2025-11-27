import React, { useState, useEffect, useMemo } from 'react';
import {
  Fab,
  Box,
  Slide,
  Fade,
  Zoom,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Pets as PetsIcon,
  ShoppingBag as ShoppingBagIcon,
  Favorite as FavoriteIcon,
  Star as StarIcon,
  WhatsApp as WhatsAppIcon,
  Visibility as VisibilityIcon,
  ExpandLess as ExpandLessIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import mascotaService from '../services/mascotaService';
import productService from '../services/productService';

const ChatbotComponent = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const [products, setProducts] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Paleta de colores pastel para IA
  const colorPalette = {
    primary: '#A8D8EA',
    secondary: '#FFAAA7',
    accent: '#FFD3B5',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#424242',
    textLight: '#757575',
    userBubble: '#E3F2FD',
    botBubble: '#F5F5F5',
    success: '#C8E6C9',
    warning: '#FFECB3'
  };

  // Mapeo MEJORADO de alergias y sus sinónimos basado en las relaciones específicas
  const alergiasMap = {
    'Pollo': ['pollo', 'gallina', 'ave', 'carne de ave', 'poultry', 'chicken', 'aves', 'pollos', 'gallinas', 'carne de pollo', 'pavo'],
    'Cereales': ['cereales', 'trigo', 'maíz', 'maiz', 'arroz', 'avena', 'cebada', 'grain', 'cereal', 'wheat', 'corn', 'rice', 'granos', 'granos enteros', 'harina', 'gluten', 'harina de trigo', 'harina de maíz'],
    'Soya': ['soya', 'soja', 'soja', 'glycine max', 'soy', 'soja', 'soya texturizada', 'proteína de soya', 'lecitina de soya', 'aceite de soya'],
    'Papa': ['papa', 'patata', 'solanum tuberosum', 'potato', 'papas', 'patatas', 'papa natural'],
    'Camote': ['camote', 'batata', 'papa dulce', 'ipomoea batatas', 'sweet potato', 'boniatos', 'camotes'],
    'Legumbres': ['legumbres', 'lentejas', 'garbanzos', 'frijoles', 'judías', 'alubias', 'legumes', 'beans', 'lentils', 'leguminosas', 'guisantes', 'habas'],
    'Aceites vegetales': ['aceite vegetal', 'aceite de soja', 'aceite de maíz', 'aceite de girasol', 'aceite de canola', 'vegetable oil', 'aceites refinados', 'aceite vegetal refinado', 'aceite de oliva']
  };

  // Mapeo MEJORADO de objetivos nutricionales basado en las relaciones específicas
  const objetivosMap = {
    'Control de peso': ['control de peso', 'peso', 'adelgazar', 'obesidad', 'sobrepeso', 'weight control', 'weight management', 'bajo en calorías', 'mantenimiento de peso', 'dieta', 'reducir peso', 'light', 'bajo en grasa'],
    'Aumento de energía o masa muscular': ['energía', 'masa muscular', 'proteína', 'musculo', 'energetico', 'energy', 'muscle', 'protein', 'fortalecimiento', 'desarrollo muscular', 'ganancia muscular', 'alto en proteína', 'proteico', 'energético'],
    'Apoyo Digestivo': ['digestión', 'digestivo', 'sensible', 'prebiótico', 'probiótico', 'fibra', 'digest', 'sensitive stomach', 'digestive health', 'salud intestinal', 'flora intestinal', 'probióticos', 'digestivo sensible'],
    'Piel y pelaje saludables': ['piel', 'pelaje', 'brillante', 'saludable', 'dermatológico', 'caspa', 'picor', 'skin', 'coat', 'fur', 'pelage', 'pelo brillante', 'dermatitis', 'omega', 'ácidos grasos', 'dermosalud'],
    'Soporte articular o movilidad': ['articular', 'movilidad', 'articulaciones', 'cartílago', 'artritis', 'huesos', 'joint', 'mobility', 'arthritis', 'condroitín', 'glucosamina', 'flexibilidad', 'soporte articular'],
    'Soporte inmunológico': ['inmunológico', 'defensas', 'inmunidad', 'resistencia a enfermedades', 'immune', 'defense', 'immunity', 'sistema inmunitario', 'anticuerpos', 'defensas naturales', 'inmunidad'],
    'Vitalidad y longevidad': ['vitalidad', 'longevidad', 'vejez', 'anciano', 'senior', 'vital', 'longevity', 'vitality', 'adulto mayor', 'tercera edad', 'envejecimiento saludable'],
    'Control del nivel de azúcar': ['azúcar', 'glucosa', 'diabetes', 'insulina', 'control de azúcar', 'sugar', 'glucose', 'diabetic', 'nivel glucémico', 'glicemia', 'bajo en azúcar', 'yacón']
  };

  // Mapeo de nivel de actividad
  const nivelActividadMap = {
    'Sedentario': ['sedentario', 'poco activo', 'baja actividad', 'sedentaria'],
    'Moderadamente activo': ['moderado', 'actividad moderada', 'moderadamente activo'],
    'Muy activo': ['activo', 'muy activo', 'alta actividad', 'energético']
  };

  // Mapeo de edad
  const edadMap = {
    'Cachorro': ['cachorro', 'cachorros', 'joven', 'jóvenes', 'puppy', 'puppies'],
    'Adulto': ['adulto', 'adultos', 'adult'],
    'Joven Adulto': ['joven adulto', 'adulto joven'],
    'Senior': ['senior', 'viejo', 'anciano', 'tercera edad', 'adulto mayor', 'aged']
  };

  useEffect(() => {
    if (user) {
      fetchMascotas();
      fetchProducts();
    }
  }, [user]);

  const fetchMascotas = async () => {
    try {
      const data = await mascotaService.getMascotas();
      setMascotas(data);
    } catch (error) {
      console.error('Error fetching mascotas:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getProductos();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getMascotaId = (m) => (m && (m.MascotaID ?? m.mascotaID ?? m.id ?? m.idMascota ?? m.id_mascota));
  const whatsappNumber = '51956550376';

  // Función mejorada para normalizar texto
  const normalizeText = (text) => {
    return text?.toString().toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, ' ')
      .trim() || '';
  };

  // Función para extraer alergias de las notas adicionales
  const extraerAlergiasDeNotas = (notas) => {
    if (!notas) return [];
    
    const alergiasEncontradas = [];
    const notasNormalizadas = normalizeText(notas);
    
    // Buscar cada alergia en las notas
    Object.keys(alergiasMap).forEach(alergia => {
      const sinonimos = alergiasMap[alergia];
      const encontrado = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(notasNormalizadas);
      });
      
      if (encontrado) {
        alergiasEncontradas.push(alergia);
      }
    });
    
    return alergiasEncontradas;
  };

  // Función para extraer objetivos nutricionales de las notas adicionales
  const extraerObjetivosDeNotas = (notas) => {
    if (!notas) return [];
    
    const objetivosEncontrados = [];
    const notasNormalizadas = normalizeText(notas);
    
    // Buscar cada objetivo en las notas
    Object.keys(objetivosMap).forEach(objetivo => {
      const sinonimos = objetivosMap[objetivo];
      const encontrado = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(notasNormalizadas);
      });
      
      if (encontrado) {
        objetivosEncontrados.push(objetivo);
      }
    });
    
    return objetivosEncontrados;
  };

  // Función para extraer nivel de actividad de las notas adicionales
  const extraerNivelActividadDeNotas = (notas) => {
    if (!notas) return '';
    
    const notasNormalizadas = normalizeText(notas);
    
    // Buscar cada nivel de actividad en las notas
    for (const [nivel, sinonimos] of Object.entries(nivelActividadMap)) {
      const encontrado = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(notasNormalizadas);
      });
      
      if (encontrado) {
        return nivel;
      }
    }
    
    return '';
  };

  // Función para extraer edad de las notas adicionales
  const extraerEdadDeNotas = (notas) => {
    if (!notas) return '';
    
    const notasNormalizadas = normalizeText(notas);
    
    // Buscar cada edad en las notas
    for (const [edad, sinonimos] of Object.entries(edadMap)) {
      const encontrado = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(notasNormalizadas);
      });
      
      if (encontrado) {
        return edad;
      }
    }
    
    return '';
  };

  // Función para extraer la sección "Recomendado para" de la descripción
  const extraerSeccionRecomendadoPara = (descripcion) => {
    if (!descripcion) return '';
    
    const descripcionNormalizada = normalizeText(descripcion);
    
    // Buscar patrones comunes para "Recomendado para"
    const patrones = [
      /recomendado para[\s:]+([^.!?]*)/i,
      /ideal para[\s:]+([^.!?]*)/i,
      /recomendado[\s:]+([^.!?]*)/i,
      /especial para[\s:]+([^.!?]*)/i,
      /beneficios[\s:]+([^.!?]*)/i,
      /indicado para[\s:]+([^.!?]*)/i
    ];
    
    for (const patron of patrones) {
      const match = descripcion.match(patron);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return '';
  };

  // Función MEJORADA para verificar alergias - BUSQUEDA EN NOMBRE Y DESCRIPCIÓN
  const contieneAlergenos = (producto, alergias) => {
    if (!alergias || alergias.length === 0) return false;
    
    const nombre = normalizeText(producto.nombre || producto.Nombre || '');
    const descripcion = normalizeText(producto.descripcion || producto.Descripcion || '');
    const ingredientes = normalizeText(producto.ingredientes || producto.Ingredientes || '');
    
    const textoCompleto = `${nombre} ${descripcion} ${ingredientes}`;

    // Buscar en cada alergia y sus sinónimos
    for (const alergia of alergias) {
      const sinonimos = alergiasMap[alergia] || [normalizeText(alergia)];
      for (const sinonimo of sinonimos) {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        if (patron.test(textoCompleto)) {
          console.log(`❌ Producto excluido: "${producto.nombre}" - contiene alergeno: ${alergia} (sinónimo: ${sinonimo})`);
          return true;
        }
      }
    }
    
    return false;
  };

  // Función MEJORADA para calcular puntuación de objetivos - ENFOCADA EN "RECOMENDADO PARA"
  const calcularPuntuacionObjetivos = (producto, objetivos) => {
    if (!objetivos || objetivos.length === 0) return 0;
    
    const descripcion = producto.descripcion || producto.Descripcion || '';
    const nombre = normalizeText(producto.nombre || producto.Nombre || '');
    
    // Extraer la sección "Recomendado para" específicamente
    const seccionRecomendado = extraerSeccionRecomendadoPara(descripcion);
    const descripcionCompleta = normalizeText(descripcion);
    const seccionRecomendadoNormalizada = normalizeText(seccionRecomendado);
    
    console.log(`📋 Analizando producto: ${producto.nombre}`);
    console.log(`🔍 Sección "Recomendado para": ${seccionRecomendado}`);
    
    return objetivos.reduce((puntuacion, objetivo) => {
      const sinonimos = objetivosMap[objetivo] || [normalizeText(objetivo)];
      let puntuacionObjetivo = 0;
      
      // Buscar en la sección "Recomendado para" (PRIORIDAD ALTA - 3 puntos)
      if (seccionRecomendadoNormalizada) {
        const encontradoEnSeccion = sinonimos.some(sinonimo => {
          const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
          return patron.test(seccionRecomendadoNormalizada);
        });
        if (encontradoEnSeccion) {
          console.log(`🎯 Objetivo "${objetivo}" encontrado en sección "Recomendado para"`);
          puntuacionObjetivo += 3;
        }
      }
      
      // Buscar en toda la descripción (PRIORIDAD MEDIA - 1 punto)
      const encontradoEnDescripcion = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(descripcionCompleta);
      });
      if (encontradoEnDescripcion && puntuacionObjetivo === 0) {
        console.log(`📝 Objetivo "${objetivo}" encontrado en descripción general`);
        puntuacionObjetivo += 1;
      }

      // Buscar en el nombre del producto (PRIORIDAD BAJA - 0.5 puntos)
      const encontradoEnNombre = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(nombre);
      });
      if (encontradoEnNombre && puntuacionObjetivo === 0) {
        console.log(`🏷️ Objetivo "${objetivo}" encontrado en nombre del producto`);
        puntuacionObjetivo += 0.5;
      }
      
      return puntuacion + puntuacionObjetivo;
    }, 0);
  };

  // Función para calcular puntuación adicional por nivel de actividad
  const calcularPuntuacionNivelActividad = (producto, nivelActividad) => {
    if (!nivelActividad) return 0;
    
    const descripcion = producto.descripcion || producto.Descripcion || '';
    const seccionRecomendado = extraerSeccionRecomendadoPara(descripcion);
    const descripcionCompleta = normalizeText(descripcion);
    const seccionRecomendadoNormalizada = normalizeText(seccionRecomendado);
    
    const sinonimos = nivelActividadMap[nivelActividad] || [normalizeText(nivelActividad)];
    let puntuacion = 0;
    
    // Buscar en sección "Recomendado para"
    if (seccionRecomendadoNormalizada) {
      const encontradoEnSeccion = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(seccionRecomendadoNormalizada);
      });
      if (encontradoEnSeccion) {
        puntuacion += 2;
      }
    }
    
    // Buscar en descripción general
    const encontradoEnDescripcion = sinonimos.some(sinonimo => {
      const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
      return patron.test(descripcionCompleta);
    });
    if (encontradoEnDescripcion) {
      puntuacion += 1;
    }
    
    return puntuacion;
  };

  // Función para calcular puntuación adicional por edad
  const calcularPuntuacionEdad = (producto, edad) => {
    if (!edad) return 0;
    
    const descripcion = producto.descripcion || producto.Descripcion || '';
    const seccionRecomendado = extraerSeccionRecomendadoPara(descripcion);
    const descripcionCompleta = normalizeText(descripcion);
    const seccionRecomendadoNormalizada = normalizeText(seccionRecomendado);
    
    const sinonimos = edadMap[edad] || [normalizeText(edad)];
    let puntuacion = 0;
    
    // Buscar en sección "Recomendado para"
    if (seccionRecomendadoNormalizada) {
      const encontradoEnSeccion = sinonimos.some(sinonimo => {
        const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
        return patron.test(seccionRecomendadoNormalizada);
      });
      if (encontradoEnSeccion) {
        puntuacion += 2;
      }
    }
    
    // Buscar en descripción general
    const encontradoEnDescripcion = sinonimos.some(sinonimo => {
      const patron = new RegExp(`\\b${normalizeText(sinonimo)}\\b`, 'i');
      return patron.test(descripcionCompleta);
    });
    if (encontradoEnDescripcion) {
      puntuacion += 1;
    }
    
    return puntuacion;
  };

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (showChatbot && conversation.length === 0) {
      const welcomeMessage = {
        type: 'bot',
        content: user 
          ? `¡Hola ${user.name}! 👋 Soy Coco AI, tu asistente virtual de Patitas y Sabores.\n\nPuedo ayudarte a encontrar productos perfectos para tus mascotas y ofrecerte recomendaciones personalizadas. ¿Por dónde empezamos?`
          : '¡Hola! 👋 Soy Coco AI, tu asistente virtual de Patitas y Sabores.\n\nPuedo ayudarte a encontrar productos perfectos para tus mascotas y ofrecerte recomendaciones personalizadas. ¿Por dónde empezamos?',
        timestamp: new Date()
      };
      setConversation([welcomeMessage]);
    }
  }, [showChatbot, user, conversation.length]);

  const addMessage = (content, type = 'bot', options = null) => {
    const newMessage = {
      type,
      content,
      timestamp: new Date(),
      options
    };
    setConversation(prev => [...prev, newMessage]);
  };

  const handleQuickReply = (action, value = null) => {
    addMessage(value || action, 'user');
    setLoading(true);

    setTimeout(() => {
      switch (action) {
        case 'recomendaciones':
          handleRecommendations();
          break;
        case 'productos':
          handleProductos();
          break;
        case 'seleccionar_mascota':
          handleSelectMascota(value);
          break;
        case 'inicio':
          handleDefault();
          break;
        default:
          handleDefault();
      }
      setLoading(false);
    }, 800);
  };

  const handleRecommendations = () => {
    if (!mascotas || mascotas.length === 0) {
      addMessage(
        `No veo mascotas registradas en tu perfil aún. 📝\n\nPara obtener recomendaciones personalizadas, primero registra a tu mascota en la sección "Mis Mascotas". Luego podré analizar sus necesidades específicas y sugerirte los productos más adecuados.`,
        'bot',
        [
          { label: '🛍️ Explorar Productos', action: 'productos' },
          { label: '💬 Menú Principal', action: 'inicio' }
        ]
      );
      return;
    }

    if (mascotas.length > 1) {
      addMessage(
        'Veo que tienes varias mascotas registradas. 🐕🐈\n\n¿Para cuál de ellas te gustaría que prepare recomendaciones personalizadas?',
        'bot',
        mascotas.map(mascota => ({
          label: `${mascota.nombre} (${mascota.especie})`,
          action: 'seleccionar_mascota',
          value: getMascotaId(mascota)
        }))
      );
      return;
    }

    const mascota = mascotas[0];
    handleRecommendationsForMascota(getMascotaId(mascota));
  };

  const handleSelectMascota = (mascotaId) => {
    const mascota = mascotas.find(m => String(getMascotaId(m)) === String(mascotaId));
    if (mascota) {
      addMessage(`Perfecto! Preparando recomendaciones personalizadas para ${mascota.nombre}... 🎯`, 'bot');
      setTimeout(() => {
        handleRecommendationsForMascota(mascotaId);
      }, 1200);
    }
  };

  const handleRecommendationsForMascota = async (mascotaId) => {
    const mascota = mascotas.find(m => String(getMascotaId(m)) === String(mascotaId));
    if (!mascota) {
      addMessage('No pude encontrar la mascota seleccionada. ¿Podrías intentarlo de nuevo?', 'bot');
      return;
    }

    try {
      const nombre = mascota.nombre || 'tu mascota';
      const notasAdicionales = mascota.notas_adicionales || mascota.notasAdicionales || mascota.NotasAdicionales || '';
      
      // Extraer información de las notas adicionales
      const alergias = extraerAlergiasDeNotas(notasAdicionales);
      const objetivos = extraerObjetivosDeNotas(notasAdicionales);
      const nivelActividad = extraerNivelActividadDeNotas(notasAdicionales);
      const edad = extraerEdadDeNotas(notasAdicionales);

      console.log('🔍 Información extraída de notas:', {
        notasAdicionales,
        alergias,
        objetivos,
        nivelActividad,
        edad
      });

      // Mostrar criterios de recomendación ANTES de generar las recomendaciones
      let criteriosMessage = `📋 Estoy generando recomendaciones para ${nombre} basándome en:\n\n`;
      
      criteriosMessage += `🔍 Alergias a excluir: ${alergias.length > 0 ? alergias.join(', ') : 'Ninguna detectada'}\n`;
      criteriosMessage += `🎯 Objetivos nutricionales: ${objetivos.length > 0 ? objetivos.join(', ') : 'Ninguno detectado'}\n`;
      criteriosMessage += `⚡ Nivel de actividad: ${nivelActividad || 'No especificado'}\n`;
      criteriosMessage += `📅 Edad: ${edad || 'No especificada'}\n\n`;
      
      if (notasAdicionales) {
        criteriosMessage += `📝 Notas adicionales analizadas: ${notasAdicionales}\n\n`;
      }
      
      criteriosMessage += `🔄 Procesando recomendaciones...`;

      addMessage(criteriosMessage, 'bot');

      // Pequeña pausa para que el usuario pueda leer los criterios
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log(`🔍 Generando recomendaciones para ${nombre}:`, { alergias, objetivos, nivelActividad, edad });

      // FILTRADO ESTRICTO POR ALERGIAS - PRIORIDAD MÁXIMA
      const productosSinAlergenos = products.filter(producto => {
        return !contieneAlergenos(producto, alergias);
      });

      console.log(`📊 Productos después de filtrar alergias: ${productosSinAlergenos.length} de ${products.length}`);

      // Si no hay productos después del filtrado por alergias
      if (productosSinAlergenos.length === 0) {
        let mensaje = `Basado en el perfil de ${nombre}`;
        if (alergias.length > 0) {
          mensaje += ` (excluyendo productos con: ${alergias.join(', ')})`;
        }
        mensaje += `, no encontré productos seguros que cumplan con las restricciones de alergias. 😔\n\nTe recomiendo explorar todos nuestros productos o ajustar las alergias registradas.`;

        addMessage(
          mensaje,
          'bot',
          [
            { label: '🛍️ Explorar Todos los Productos', action: 'productos' },
            { label: '💬 Menú Principal', action: 'inicio' }
          ]
        );
        return;
      }

      // CALCULAR PUNTUACIÓN TOTAL PARA PRODUCTOS SEGUROS
      const productosRecomendados = productosSinAlergenos
        .map(producto => {
          const puntuacionObjetivos = calcularPuntuacionObjetivos(producto, objetivos);
          const puntuacionActividad = calcularPuntuacionNivelActividad(producto, nivelActividad);
          const puntuacionEdad = calcularPuntuacionEdad(producto, edad);
          
          const puntuacionTotal = puntuacionObjetivos + puntuacionActividad + puntuacionEdad;
          
          console.log(`📦 Producto: ${producto.nombre}, Puntos objetivos: ${puntuacionObjetivos}, Actividad: ${puntuacionActividad}, Edad: ${puntuacionEdad}, TOTAL: ${puntuacionTotal}`);
          
          return {
            ...producto,
            puntuacion: puntuacionTotal,
            puntuacionObjetivos,
            puntuacionActividad,
            puntuacionEdad
          };
        })
        .filter(producto => producto.puntuacion > 0) // Solo productos que cumplan al menos un criterio
        .sort((a, b) => {
          // Primero por puntuación total (mayor a menor)
          if (b.puntuacion !== a.puntuacion) {
            return b.puntuacion - a.puntuacion;
          }
          // Luego por puntuación de objetivos (mayor a menor)
          if (b.puntuacionObjetivos !== a.puntuacionObjetivos) {
            return b.puntuacionObjetivos - a.puntuacionObjetivos;
          }
          // Finalmente por precio (mayor a menor)
          return (b.precio || 0) - (a.precio || 0);
        })
        .slice(0, 3); // MÁXIMO 3 PRODUCTOS

      console.log('🎯 Productos recomendados finales:', productosRecomendados);

      // Mensaje de recomendación
      let mensajeRecomendacion = `✨ He encontrado ${productosRecomendados.length} productos perfectos para ${nombre}:\n\n`;
      mensajeRecomendacion += `✅ Filtrado por alergias: ${alergias.length > 0 ? `Excluyendo: ${alergias.join(', ')}` : 'Sin restricciones'}\n`;
      mensajeRecomendacion += `🎯 Objetivos priorizados: ${objetivos.length > 0 ? objetivos.join(', ') : 'Búsqueda general'}\n`;
      
      if (productosRecomendados.length === 0) {
        mensajeRecomendacion = `Basándome en los criterios establecidos para ${nombre}, no encontré productos que cumplan con todas las especificaciones. 😔\n\nTe sugiero explorar todos nuestros productos disponibles o ajustar algunos criterios.`;
        
        addMessage(
          mensajeRecomendacion,
          'bot',
          [
            { label: '🛍️ Explorar Productos', action: 'productos' },
            { label: '💬 Menú Principal', action: 'inicio' }
          ]
        );
        return;
      }

      addMessage(mensajeRecomendacion, 'bot');

      // Mostrar productos recomendados con delay suave
      productosRecomendados.forEach((producto, index) => {
        setTimeout(() => {
          addMessage('', 'bot', { type: 'product', product: producto });
        }, index * 800);
      });

      // Mensaje final con opciones
      setTimeout(() => {
        addMessage(
          '¿Te gustaría explorar más opciones o necesitas ayuda con algo más?',
          'bot',
          [
            { label: '🛍️ Ver Más Productos', action: 'productos' },
            { label: '🎯 Otra Recomendación', action: 'recomendaciones' },
            { label: '💬 Menú Principal', action: 'inicio' }
          ]
        );
      }, productosRecomendados.length * 800 + 500);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      addMessage(
        'Lo siento, hubo un error al generar las recomendaciones. Por favor, intenta de nuevo.',
        'bot',
        [
          { label: '🔄 Intentar Nuevamente', action: 'recomendaciones' },
          { label: '🛍️ Explorar Productos', action: 'productos' }
        ]
      );
    }
  };

  const handleProductos = () => {
    if (products.length === 0) {
      addMessage(
        'Actualmente no hay productos disponibles. Estamos trabajando para agregar nuevos productos muy pronto! ⏳',
        'bot',
        [
          { label: '🎯 Obtener Recomendaciones', action: 'recomendaciones' },
          { label: '💬 Menú Principal', action: 'inicio' }
        ]
      );
      return;
    }

    addMessage(
      'Aquí tienes nuestros productos disponibles: 🛍️',
      'bot'
    );

    const sortedProducts = [...products].sort((a, b) => {
      const catA = a.categoria || 'Otros';
      const catB = b.categoria || 'Otros';
      if (catA !== catB) return catA.localeCompare(catB);
      return (b.precio || 0) - (a.precio || 0);
    });

    // Mostrar productos en grupos de 2 con animaciones suaves
    const productBatches = [];
    for (let i = 0; i < sortedProducts.length; i += 2) {
      productBatches.push(sortedProducts.slice(i, i + 2));
    }

    productBatches.forEach((batch, batchIndex) => {
      setTimeout(() => {
        batch.forEach((product, productIndex) => {
          setTimeout(() => {
            addMessage('', 'bot', { type: 'product', product });
          }, productIndex * 400);
        });
        
        if (batchIndex === productBatches.length - 1) {
          setTimeout(() => {
            addMessage(
              '¿En qué más puedo ayudarte?',
              'bot',
              [
                { label: '🎯 Recomendaciones Personalizadas', action: 'recomendaciones' },
                { label: '💬 Menú Principal', action: 'inicio' }
              ]
            );
          }, 1000);
        }
      }, batchIndex * 1000);
    });
  };

  const handleDefault = () => {
    addMessage(
      '¡Hola de nuevo! ¿En qué puedo ayudarte hoy? 😊\n\nPuedo ofrecerte recomendaciones personalizadas para tus mascotas o mostrarte nuestro catálogo completo de productos.',
      'bot',
      [
        { label: '🎯 Recomendaciones', action: 'recomendaciones' },
        { label: '🛍️ Ver Productos', action: 'productos' }
      ]
    );
  };

  const handleProductAction = (product, action) => {
    if (action === 'view') {
      const productId = product.productoID || product.ProductoID || product.id;
      if (productId) {
        window.open(`/productos/${productId}`, '_blank');
      }
    } else if (action === 'buy') {
      const nombre = product.nombre || product.Nombre || 'Producto';
      const precio = product.precio ?? product.Precio;
      const text = `Hola! Estoy interesado en comprar: ${nombre}${precio ? ` (S/${precio})` : ''}. ¿Pueden brindarme más información?`;
      const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  // Componente ProductCard MEJORADO con manejo simple y efectivo de imágenes
  const ProductCard = ({ product }) => {
    const nombre = product.nombre || product.Nombre || 'Sin nombre';
    const precio = (product.precio ?? product.Precio) !== undefined ? (product.precio ?? product.Precio) : null;
    
    // Función SIMPLIFICADA para obtener imágenes - Asume que las imágenes están en /images/products/
    const getProductImage = () => {
      // Buscar en las propiedades comunes de imagen
      const propiedadesImagen = ['imagen', 'Imagen', 'imagenURL', 'image', 'Image', 'fileName', 'nombreImagen'];
      
      for (let prop of propiedadesImagen) {
        if (product[prop] && typeof product[prop] === 'string' && product[prop].trim() !== '') {
          let imagenUrl = product[prop].trim();
          
          // Si ya es una URL completa, usar directamente
          if (imagenUrl.startsWith('http') || imagenUrl.startsWith('//') || imagenUrl.startsWith('data:')) {
            return imagenUrl;
          }
          
          // Si ya es una ruta absoluta, usar directamente
          if (imagenUrl.startsWith('/')) {
            return imagenUrl;
          }
          
          // Para cualquier otro caso, asumir que es un nombre de archivo en /images/products/
          // Extraer solo el nombre del archivo (por si viene con rutas relativas)
          const nombreArchivo = imagenUrl.split('/').pop() || imagenUrl.split('\\').pop() || imagenUrl;
          return `/images/products/${nombreArchivo}`;
        }
      }
      
      return null;
    };

    const imagenUrl = getProductImage();
    const [imageError, setImageError] = useState(false);

    console.log(`🖼️ Imagen para ${nombre}:`, imagenUrl);

    return (
      <Fade in timeout={800}>
        <Card 
          sx={{ 
            mb: 2, 
            border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
            borderRadius: 3,
            background: colorPalette.surface,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Imagen del producto - ENFOQUE SIMPLIFICADO */}
              <Box sx={{ position: 'relative', flexShrink: 0 }}>
                {imagenUrl && !imageError ? (
                  <Avatar 
                    src={imagenUrl}
                    onError={() => {
                      console.log('❌ Error cargando imagen:', imagenUrl);
                      setImageError(true);
                    }}
                    sx={{ 
                      width: 70, 
                      height: 70,
                      borderRadius: 2,
                      border: `2px solid ${colorPalette.primary}`,
                      backgroundColor: colorPalette.background
                    }} 
                    variant="rounded"
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 70, 
                      height: 70,
                      borderRadius: 2,
                      backgroundColor: colorPalette.accent,
                      border: `2px solid ${colorPalette.primary}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }} 
                    variant="rounded"
                  >
                    <LocalOfferIcon sx={{ color: colorPalette.text, fontSize: 30 }} />
                  </Avatar>
                )}
              </Box>
              
              {/* Información del producto */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="600" 
                    color={colorPalette.text}
                    sx={{ 
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      flex: 1,
                      mr: 1
                    }}
                  >
                    {nombre}
                  </Typography>
                  {precio && (
                    <Chip 
                      label={`S/ ${precio}`} 
                      size="small"
                      sx={{ 
                        backgroundColor: colorPalette.success,
                        color: colorPalette.text,
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        flexShrink: 0,
                        height: 24,
                        minWidth: 'auto',
                        px: 1
                      }}
                    />
                  )}
                </Box>
                
                {/* Categoría */}
                {product.categoria && (
                  <Chip 
                    label={product.categoria}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      mb: 1,
                      fontSize: '0.6rem',
                      height: 20,
                      borderColor: colorPalette.primary,
                      color: colorPalette.textLight
                    }}
                  />
                )}
                
                {/* Botones compactos */}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button
                    onClick={() => handleProductAction(product, 'view')}
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                    sx={{ 
                      borderRadius: 2,
                      fontSize: '0.7rem',
                      borderColor: colorPalette.primary,
                      color: colorPalette.primary,
                      '&:hover': {
                        backgroundColor: alpha(colorPalette.primary, 0.1),
                        borderColor: colorPalette.primary,
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease',
                      minWidth: 'auto',
                      px: 1.5,
                      height: 28
                    }}
                  >
                    Ver
                  </Button>
                  <Button
                    onClick={() => handleProductAction(product, 'buy')}
                    variant="contained"
                    size="small"
                    startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                    sx={{ 
                      borderRadius: 2,
                      fontSize: '0.7rem',
                      backgroundColor: colorPalette.primary,
                      color: colorPalette.text,
                      '&:hover': {
                        backgroundColor: alpha(colorPalette.primary, 0.8),
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease',
                      minWidth: 'auto',
                      px: 1.5,
                      height: 28
                    }}
                  >
                    Comprar
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  const QuickReplies = ({ options }) => (
    <Fade in timeout={800}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {options.map((option, index) => (
          <Chip
            key={index}
            label={option.label}
            onClick={() => handleQuickReply(option.action, option.value)}
            clickable
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: colorPalette.primary,
              color: colorPalette.text,
              backgroundColor: colorPalette.surface,
              '&:hover': {
                backgroundColor: alpha(colorPalette.primary, 0.15),
                transform: 'scale(1.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              },
              transition: 'all 0.3s ease',
              fontSize: '0.8rem',
              height: 32
            }}
          />
        ))}
      </Box>
    </Fade>
  );

  // Componente MessageBubble MEJORADO con animaciones suaves sin parpadeo
  const MessageBubble = ({ message, index }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, index * 150); // Delay escalonado más suave

      return () => clearTimeout(timer);
    }, [index]);

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
          mb: 2,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(5px)',
          transition: 'all 0.5s ease'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
            maxWidth: '85%'
          }}
        >
          {message.type === 'bot' && (
            <Avatar
              src="/assets/chatbot.png"
              sx={{
                width: 32,
                height: 32,
                border: `2px solid ${colorPalette.primary}`
              }}
            />
          )}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: message.type === 'user' 
                ? `linear-gradient(135deg, ${colorPalette.userBubble} 0%, ${alpha(colorPalette.primary, 0.3)} 100%)`
                : `linear-gradient(135deg, ${colorPalette.botBubble} 0%, ${alpha(colorPalette.accent, 0.1)} 100%)`,
              color: colorPalette.text,
              border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              whiteSpace: 'pre-line',
              lineHeight: 1.5
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {message.content}
            </Typography>
            {message.options && message.options.type === 'product' && (
              <ProductCard product={message.options.product} />
            )}
            {message.options && Array.isArray(message.options) && (
              <QuickReplies options={message.options} />
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  const ChatHeader = () => (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
        background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.accent} 100%)`,
        color: colorPalette.text,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src="/assets/chatbot.png"
          sx={{ 
            width: 40, 
            height: 40,
            border: `2px solid ${colorPalette.surface}`
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Conversa con Coco AI
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Patitas y Sabores • En línea
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => setIsMinimized(!isMinimized)}
            sx={{ color: colorPalette.text }}
          >
            <ExpandLessIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setShowChatbot(false)}
            sx={{ color: colorPalette.text }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  const QuickActions = () => (
    <Fade in timeout={800}>
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${alpha(colorPalette.primary, 0.1)}`,
        backgroundColor: colorPalette.background
      }}>
        <Typography variant="caption" color={colorPalette.textLight} gutterBottom>
          Acciones rápidas:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {[
            { label: '🎯 Recomendaciones', action: 'recomendaciones' },
            { label: '🛍️ Productos', action: 'productos' }
          ].map((action, index) => (
            <Chip
              key={index}
              label={action.label}
              onClick={() => handleQuickReply(action.action)}
              size="small"
              clickable
              sx={{
                borderRadius: 2,
                backgroundColor: alpha(colorPalette.primary, 0.1),
                color: colorPalette.text,
                border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
                '&:hover': {
                  backgroundColor: alpha(colorPalette.primary, 0.2),
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease',
                fontSize: '0.75rem',
                height: 28
              }}
            />
          ))}
        </Box>
      </Box>
    </Fade>
  );

  if (!showChatbot) {
    return (
      <Tooltip title="Conversa con Coco AI!" placement="left" arrow>
        <Fade in timeout={800}>
          <Fab
            color="primary"
            aria-label="chat"
            onClick={() => setShowChatbot(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.accent} 100%)`,
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: `0 4px 20px ${alpha(colorPalette.primary, 0.3)}`
              },
              transition: 'all 0.3s ease',
              zIndex: 1000
            }}
          >
            <Box
              component="img"
              src="/assets/chatbot.png"
              alt="Coco AI Assistant"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%'
              }}
            />
          </Fab>
        </Fade>
      </Tooltip>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          width: isMobile ? 'calc(100vw - 32px)' : 400,
          height: isMinimized ? 60 : 600,
          maxHeight: isMobile ? '70vh' : 'none',
          backgroundColor: colorPalette.background,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000
        }}
      >
        <ChatHeader />
        
        {!isMinimized && (
          <>
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 2,
                background: colorPalette.background
              }}
            >
              {conversation.map((message, index) => (
                <MessageBubble 
                  key={index} 
                  message={message} 
                  index={index}
                />
              ))}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src="/assets/chatbot.png"
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: colorPalette.botBubble,
                        border: `1px solid ${alpha(colorPalette.primary, 0.2)}`
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 1, 2].map(i => (
                          <Box
                            key={i}
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: colorPalette.primary,
                              animation: 'pulse 1.4s ease-in-out infinite both',
                              animationDelay: `${i * 0.16}s`
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            <QuickActions />
          </>
        )}
      </Box>
    </Fade>
  );
};

export default ChatbotComponent;