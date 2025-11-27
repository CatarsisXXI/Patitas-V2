import React, { useState, useEffect, useRef } from 'react';
import {
  Fab,
  Box,
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
  Visibility as VisibilityIcon,
  LocalOffer as LocalOfferIcon,
  WhatsApp as WhatsAppIcon
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
  const [typingMessage, setTypingMessage] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // URL base del backend - MODIFICADO
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:7000'; // Ajusta según tu backend

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

  // Mapeo directo de productos según tu lógica específica
  const productRelations = {
    // Alergias - productos a EXCLUIR
    alergias: {
      'Pollo': [
        'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)',
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)'
      ],
      'Cereales': [
        'Vital Omega Crunch (Harina de Linaza y Zapallo)',
        'Galletas Dermosalud (Aceite de Oliva y Plátano)',
        'Bocaditos Digest Fit (Plátano y Cúrcuma)'
      ],
      'Camote': [
        'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)'
      ],
      'Aceite vegetal': [ 
        'Galletas Dermosalud (Aceite de Oliva y Plátano)',
        'Vital Omega Crunch (Harina de Linaza y Zapallo)'
      ]
    },
    
    // Objetivos nutricionales - productos a RECOMENDAR
    objetivos: {
      'Control de peso': [
        'Galletas Dermosalud (Aceite de Oliva y Plátano)',
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)'
      ],
      'Aumento de energía o masa muscular': [
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)',
        'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)'
      ],
      'Apoyo Digestive': [
        'Bocaditos Digest Fit (Plátano y Cúrcuma)',
        'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)',
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)'
      ],
      'Piel y pelaje saludables': [
        'Galletas Dermosalud (Aceite de Oliva y Plátano)',
        'Bocaditos Digest Fit (Plátano y Cúrcuma)',
        'Vital Omega Crunch (Harina de Linaza y Zapallo)'
      ],
      'Soporte articular o movilidad': [
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)',
        'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)',
        'Vital Omega Crunch (Harina de Linaza y Zapallo)'
      ],
      'Soporte inmunológico': [
        'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)',
        'Bocaditos Digest Fit (Plátano y Cúrcuma)',
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)'
      ],
      'Vitalidad y longevidad': [
        'Bocaditos Digest Fit (Plátano y Cúrcuma)',
        'Vital Omega Crunch (Harina de Linaza y Zapallo)'
      ],
      'Control del nivel de azúcar': [
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)'
      ]
    },
    
    // Nivel de actividad
    nivelActividad: {
      'Sedentario': [
        'Bocaditos Digest Fit (Plátano y Cúrcuma)',
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)',
        'Vital Omega Crunch (Harina de Linaza y Zapallo)'
      ],
      'Moderadamente activo': [], // Todos los productos
      'Muy activo': [
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)',
        'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)'
      ]
    },
    
    // Edad
    edad: {
      'Cachorro': [], // Todos los productos
      'Adulto': [], // Todos los productos
      'Joven Adulto': [], // Todos los productos
      'Senior': [
        'Bocaditos Digest Fit (Plátano y Cúrcuma)',
        'Galletas Yacon Light (Calabaza, Yacón y Pollo)',
        'Vital Omega Crunch (Harina de Linaza y Zapallo)'
      ]
    }
  };

  // Lista de todos los productos disponibles
  const allProducts = [
    'Galletas CarobFibra (Harina de Algarrobo, Camote y Pollo)',
    'Galletas Yacon Light (Calabaza, Yacón y Pollo)',
    'Vital Omega Crunch (Harina de Linaza y Zapallo)',
    'Galletas Dermosalud (Aceite de Oliva y Plátano)',
    'Bocaditos Digest Fit (Plátano y Cúrcuma)'
  ];

  // Scroll automático al final del chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

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
      console.log('🛍️ Datos crudos de productos:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getMascotaId = (m) => (m && (m.MascotaID ?? m.mascotaID ?? m.id ?? m.idMascota ?? m.id_mascota));
  const whatsappNumber = '51956550376';

  // Función para normalizar texto (solo para nombres de productos)
  const normalizeText = (text) => {
    return text?.toString().toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, ' ')
      .trim() || '';
  };

  // Función para extraer información de las notas adicionales
  const parseNotasAdicionales = (notas) => {
    if (!notas) {
      return {
        alergias: [],
        objetivos: [],
        nivelActividad: '',
        edad: ''
      };
    }

    const result = {
      alergias: [],
      objetivos: [],
      nivelActividad: '',
      edad: ''
    };

    try {
      // Dividir por | para separar las secciones
      const secciones = notas.split('|').map(sec => sec.trim());

      secciones.forEach(seccion => {
        // Alergias
        if (seccion.toLowerCase().includes('alergias:')) {
          const contenido = seccion.split(':')[1]?.trim() || '';
          if (contenido.toLowerCase() !== 'ninguna') {
            // Dividir por comas y limpiar cada alergia
            result.alergias = contenido.split(',')
              .map(a => a.trim())
              .filter(a => a && a.toLowerCase() !== 'ninguna');
          }
        }

        // Objetivo nutricional
        if (seccion.toLowerCase().includes('objetivo nutricional:')) {
          const contenido = seccion.split(':')[1]?.trim() || '';
          if (contenido.toLowerCase() !== 'no especificado') {
            // Extraer los objetivos principales (antes del paréntesis si existe)
            const objetivos = contenido.split(',')
              .map(obj => {
                // Remover contenido entre paréntesis
                const objetivoLimpio = obj.replace(/\([^)]*\)/g, '').trim();
                return objetivoLimpio;
              })
              .filter(obj => obj && obj.toLowerCase() !== 'no especificado');
            
            result.objetivos = objetivos;
          }
        }

        // Nivel de actividad
        if (seccion.toLowerCase().includes('nivel de actividad:')) {
          result.nivelActividad = seccion.split(':')[1]?.trim() || '';
        }

        // Edad
        if (seccion.toLowerCase().includes('edad:')) {
          result.edad = seccion.split(':')[1]?.trim() || '';
        }
      });

      console.log('📝 Notas parseadas:', result);
      return result;
    } catch (error) {
      console.error('Error parsing notas adicionales:', error);
      return result;
    }
  };

  // Función principal de recomendación basada en tu lógica
  const generarRecomendaciones = (alergias = [], objetivos = [], nivelActividad = '', edad = '') => {
    console.log('🔍 Criterios de búsqueda:', { alergias, objetivos, nivelActividad, edad });

    // PASO 1: Filtrar por alergias (EXCLUSIÓN)
    let productosFiltrados = allProducts.filter(producto => {
      // Para cada alergia, excluir los productos asociados
      for (const alergia of alergias) {
        const productosExcluir = productRelations.alergias[alergia] || [];
        if (productosExcluir.includes(producto)) {
          console.log(`❌ Excluyendo "${producto}" por alergia a ${alergia}`);
          return false;
        }
      }
      return true;
    });

    console.log(`📊 Productos después de alergias: ${productosFiltrados.length}`);

    // Si no hay productos después de filtrar alergias
    if (productosFiltrados.length === 0) {
      return [];
    }

    // PASO 2: Filtrar por objetivos nutricionales (si existen)
    if (objetivos.length > 0) {
      const productosPorObjetivo = new Set();
      
      // Para cada objetivo, agregar los productos recomendados
      objetivos.forEach(objetivo => {
        const productosObjetivo = productRelations.objetivos[objetivo] || [];
        productosObjetivo.forEach(producto => {
          if (productosFiltrados.includes(producto)) {
            productosPorObjetivo.add(producto);
          }
        });
      });

      // Si encontramos productos para los objetivos, actualizar la lista
      if (productosPorObjetivo.size > 0) {
        productosFiltrados = Array.from(productosPorObjetivo);
        console.log(`🎯 Productos después de objetivos: ${productosFiltrados.length}`);
      }
    }

    // PASO 3: Filtrar por nivel de actividad (si existe)
    if (nivelActividad && nivelActividad !== 'Moderadamente activo') {
      const productosActividad = productRelations.nivelActividad[nivelActividad] || [];
      if (productosActividad.length > 0) {
        productosFiltrados = productosFiltrados.filter(producto => 
          productosActividad.includes(producto)
        );
        console.log(`⚡ Productos después de actividad: ${productosFiltrados.length}`);
      }
    }

    // PASO 4: Filtrar por edad (si existe)
    if (edad && edad !== 'Cachorro' && edad !== 'Adulto' && edad !== 'Joven Adulto') {
      const productosEdad = productRelations.edad[edad] || [];
      if (productosEdad.length > 0) {
        productosFiltrados = productosFiltrados.filter(producto => 
          productosEdad.includes(producto)
        );
        console.log(`📅 Productos después de edad: ${productosFiltrados.length}`);
      }
    }

    console.log('🎯 Productos recomendados finales:', productosFiltrados);
    return productosFiltrados;
  };

  // Función para agregar mensaje con efecto de tipeo
  const addMessage = (content, type = 'bot', options = null) => {
    const newMessage = {
      type,
      content,
      timestamp: new Date(),
      options
    };
    
    setConversation(prev => [...prev, newMessage]);
    
    // Si es mensaje del bot, activar efecto de tipeo
    if (type === 'bot') {
      setTypingMessage(newMessage);
      setDisplayedText('');
    }
  };

  // Efecto para manejar el efecto de tipeo
  useEffect(() => {
    if (typingMessage && typingMessage.content) {
      let currentIndex = 0;
      const messageContent = typingMessage.content;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= messageContent.length) {
          setDisplayedText(messageContent.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setTypingMessage(null);
            setDisplayedText('');
          }, 500);
        }
      }, 30); // Velocidad de tipeo

      return () => clearInterval(typingInterval);
    }
  }, [typingMessage]);

  // Mensaje de bienvenida inicial con opciones
  useEffect(() => {
    if (showChatbot && conversation.length === 0) {
      const welcomeMessage = {
        type: 'bot',
        content: user 
          ? `¡Hola ${user.name}! 👋 Soy Coco AI, tu asistente virtual de Patitas y Sabores.\n\nPuedo ayudarte a encontrar productos perfectos para tus mascotas y ofrecerte recomendaciones personalizadas. ¿Por dónde empezamos?`
          : '¡Hola! 👋 Soy Coco AI, tu asistente virtual de Patitas y Sabores.\n\nPuedo ayudarte a encontrar productos perfectos para tus mascotas y ofrecerte recomendaciones personalizadas. ¿Por dónde empezamos?',
        timestamp: new Date(),
        options: [
          { label: '🎯 Recomendaciones', action: 'recomendaciones' },
          { label: '🛍️ Ver Productos', action: 'productos' }
        ]
      };
      setConversation([welcomeMessage]);
      setTypingMessage(welcomeMessage);
    }
  }, [showChatbot, user, conversation.length]);

  // MODIFICADO: Ahora recibe un objeto con id y nombre
  const handleQuickReply = (action, value = null, displayName = null) => {
    // Si es selección de mascota, mostrar el nombre en lugar del ID
    const messageContent = action === 'seleccionar_mascota' && displayName ? displayName : (value || action);
    addMessage(messageContent, 'user');
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
          handleSelectMascota(value, displayName);
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
          value: getMascotaId(mascota),
          displayName: mascota.nombre // NUEVO: agregamos el nombre para mostrar
        }))
      );
      return;
    }

    const mascota = mascotas[0];
    handleRecommendationsForMascota(getMascotaId(mascota), mascota.nombre);
  };

  // MODIFICADO: Ahora recibe también el nombre de la mascota
  const handleSelectMascota = (mascotaId, mascotaNombre = null) => {
    const mascota = mascotas.find(m => String(getMascotaId(m)) === String(mascotaId));
    if (mascota) {
      const nombre = mascotaNombre || mascota.nombre;
      addMessage(`Perfecto! Preparando recomendaciones personalizadas para ${nombre}... 🎯`, 'bot');
      setTimeout(() => {
        handleRecommendationsForMascota(mascotaId, nombre);
      }, 1200);
    }
  };

  const handleRecommendationsForMascota = async (mascotaId, mascotaNombre = null) => {
    const mascota = mascotas.find(m => String(getMascotaId(m)) === String(mascotaId));
    if (!mascota) {
      addMessage('No pude encontrar la mascota seleccionada. ¿Podrías intentarlo de nuevo?', 'bot');
      return;
    }

    try {
      const nombre = mascotaNombre || mascota.nombre || 'tu mascota';
      
      // Extraer información de las notas adicionales
      const notasInfo = parseNotasAdicionales(mascota.notas_adicionales || mascota.notasAdicionales);
      
      const alergias = notasInfo.alergias;
      const objetivos = notasInfo.objetivos;
      const nivelActividad = notasInfo.nivelActividad;
      const edad = notasInfo.edad;

      console.log('🔍 Información extraída de notas:', { alergias, objetivos, nivelActividad, edad });

      // DEBUG: Ver productos disponibles
      console.log('📦 Productos disponibles desde BD:', products);

      // Mostrar criterios de recomendación
      let criteriosMessage = `📋 Estoy generando recomendaciones para ${nombre} basándome en:\n\n`;
      
      criteriosMessage += `🔍 Alergias a excluir: ${alergias.length > 0 ? alergias.join(', ') : 'Ninguna'}\n`;
      criteriosMessage += `🎯 Objetivos nutricionales: ${objetivos.length > 0 ? objetivos.join(', ') : 'Ninguno'}\n`;
      criteriosMessage += `⚡ Nivel de actividad: ${nivelActividad || 'No especificado'}\n`;
      criteriosMessage += `📅 Edad: ${edad || 'No especificada'}\n\n`;
      
      criteriosMessage += `🔄 Procesando recomendaciones...`;

      addMessage(criteriosMessage, 'bot');

      // Pequeña pausa para que el usuario pueda leer los criterios
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar recomendaciones basadas en la lógica específica
      const productosRecomendados = generarRecomendaciones(alergias, objetivos, nivelActividad, edad);

      // Mensaje de recomendación
      let mensajeRecomendacion = `✨ He encontrado ${productosRecomendados.length} productos perfectos para ${nombre}:\n\n`;
      mensajeRecomendacion += `✅ Filtrado por alergias: ${alergias.length > 0 ? `Excluyendo: ${alergias.join(', ')}` : 'Sin restricciones'}\n`;
      
      if (objetivos.length > 0) {
        mensajeRecomendacion += `🎯 Objetivos priorizados: ${objetivos.join(', ')}\n`;
      } else {
        mensajeRecomendacion += `🎯 Objetivos: Búsqueda general de productos seguros\n`;
      }
      
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

      // Mostrar productos recomendados con efecto de tipeo
      productosRecomendados.forEach((nombreProducto, index) => {
        setTimeout(() => {
          // Buscar el producto real en la base de datos por nombre
          const productoReal = products.find(p => 
            normalizeText(p.nombre || p.Nombre) === normalizeText(nombreProducto)
          ) || { nombre: nombreProducto };
          
          addMessage('', 'bot', { type: 'product', product: productoReal });
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

    // Mostrar todos los productos con efecto de tipeo
    products.forEach((product, index) => {
      setTimeout(() => {
        addMessage('', 'bot', { type: 'product', product });
      }, index * 400);
    });

    // Mensaje final
    setTimeout(() => {
      addMessage(
        '¿En qué más puedo ayudarte?',
        'bot',
        [
          { label: '🎯 Recomendaciones Personalizadas', action: 'recomendaciones' },
          { label: '💬 Menú Principal', action: 'inicio' }
        ]
      );
    }, products.length * 400 + 500);
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

  // Componente ProductCard - CORREGIDO para usar backend URL
  const ProductCard = ({ product }) => {
    const nombre = product.nombre || product.Nombre || 'Sin nombre';
    const precio = (product.precio ?? product.Precio) !== undefined ? (product.precio ?? product.Precio) : null;
    
    // Función para obtener imágenes - CORREGIDA
    const getProductImage = () => {
      const propiedadesImagen = [
        'ImagenURL', // Agregado específicamente para tu columna de BD
        'imagenURL', 
        'imagen', 
        'Imagen', 
        'imagenUrl',
        'image', 
        'Image', 
        'fileName', 
        'nombreImagen'
      ];
      
      for (let prop of propiedadesImagen) {
        if (product[prop] && typeof product[prop] === 'string' && product[prop].trim() !== '') {
          let imagenUrl = product[prop].trim();
          
          console.log(`🖼️ Encontrada imagen en propiedad "${prop}":`, imagenUrl);
          
          // Si ya es una URL completa, retornarla directamente
          if (imagenUrl.startsWith('http') || imagenUrl.startsWith('//') || imagenUrl.startsWith('data:')) {
            return imagenUrl;
          }
          
          // Si empieza con /, construir URL completa del backend
          if (imagenUrl.startsWith('/')) {
            return `${backendUrl}${imagenUrl}`;
          }
          
          // Si es solo un nombre de archivo, construir la ruta completa en el backend
          const nombreArchivo = imagenUrl.split('/').pop() || imagenUrl.split('\\').pop() || imagenUrl;
          return `${backendUrl}/images/products/${nombreArchivo}`;
        }
      }
      
      console.log('❌ No se encontró imagen para el producto:', product);
      return null;
    };

    const imagenUrl = getProductImage();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Debug: ver qué información tiene el producto
    useEffect(() => {
      console.log('📦 Producto recibido:', product);
      console.log('🖼️ URL de imagen generada:', imagenUrl);
    }, [product, imagenUrl]);

    return (
      <Card 
        sx={{ 
          mb: 2, 
          border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
          borderRadius: 3,
          background: colorPalette.surface,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Imagen del producto - MEJORADA */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              {imagenUrl && !imageError ? (
                <Box sx={{ position: 'relative' }}>
                  {imageLoading && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 70,
                        height: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colorPalette.background,
                        borderRadius: 2,
                        zIndex: 1
                      }}
                    >
                      <Typography variant="caption" sx={{ color: colorPalette.textLight }}>
                        Cargando...
                      </Typography>
                    </Box>
                  )}
                  <Avatar 
                    src={imagenUrl}
                    onError={() => {
                      console.error('❌ Error cargando imagen:', imagenUrl);
                      setImageError(true);
                      setImageLoading(false);
                    }}
                    onLoad={() => {
                      console.log('✅ Imagen cargada correctamente:', imagenUrl);
                      setImageLoading(false);
                    }}
                    sx={{ 
                      width: 70, 
                      height: 70,
                      borderRadius: 2,
                      border: `2px solid ${colorPalette.primary}`,
                      backgroundColor: colorPalette.background,
                      opacity: imageLoading ? 0.3 : 1
                    }} 
                    variant="rounded"
                  />
                </Box>
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
                    },
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
                    },
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
    );
  };

  // MODIFICADO: QuickReplies ahora pasa displayName cuando está disponible
  const QuickReplies = ({ options }) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {options.map((option, index) => (
        <Chip
          key={index}
          label={option.label}
          onClick={() => handleQuickReply(option.action, option.value, option.displayName)}
          clickable
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: colorPalette.primary,
            color: colorPalette.text,
            backgroundColor: colorPalette.surface,
            '&:hover': {
              backgroundColor: alpha(colorPalette.primary, 0.15),
            },
            fontSize: '0.8rem',
            height: 32
          }}
        />
      ))}
    </Box>
  );

  // Componente TypingIndicator
  const TypingIndicator = () => (
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
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: colorPalette.textLight, mr: 1 }}>
              Coco está escribiendo...
            </Typography>
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
  );

  // Componente MessageBubble con efecto de tipeo
  const MessageBubble = ({ message, index }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
          mb: 2
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
                ? colorPalette.userBubble
                : colorPalette.botBubble,
              color: colorPalette.text,
              border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              whiteSpace: 'pre-line',
              lineHeight: 1.5
            }}
          >
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {typingMessage && typingMessage === message ? displayedText : message.content}
              {typingMessage && typingMessage === message && (
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: 2,
                    height: 16,
                    backgroundColor: colorPalette.primary,
                    marginLeft: 0.5,
                    animation: 'blink 1s infinite',
                    verticalAlign: 'middle'
                  }}
                />
              )}
            </Typography>
            
            {message.options && message.options.type === 'product' && (
              <ProductCard product={message.options.product} />
            )}
            
            {message.options && Array.isArray(message.options) && (
              // Solo mostrar opciones cuando el mensaje ha terminado de tipear
              (!typingMessage || typingMessage !== message) && (
                <QuickReplies options={message.options} />
              )
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
              },
              fontSize: '0.75rem',
              height: 28
            }}
          />
        ))}
      </Box>
    </Box>
  );

  if (!showChatbot) {
    return (
      <Tooltip title="Conversa con Coco AI!" placement="left" arrow>
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
              backgroundColor: alpha(colorPalette.primary, 0.8),
            },
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
      </Tooltip>
    );
  }

  return (
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
            
            {/* Mostrar indicador de tipeo si está cargando */}
            {loading && <TypingIndicator />}
            
            {/* Elemento para scroll automático */}
            <div ref={messagesEndRef} />
          </Box>
          <QuickActions />
        </>
      )}
      
      {/* Estilos para las animaciones */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default ChatbotComponent;