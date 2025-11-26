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

  // Mapeo de alergias y sus sinónimos
  const alergiasMap = {
    'Pollo': ['pollo', 'gallina', 'ave', 'carne de ave', 'poultry', 'chicken', 'aves', 'pollos'],
    'Cereales': ['cereales', 'trigo', 'maíz', 'maiz', 'arroz', 'avena', 'cebada', 'grain', 'cereal', 'wheat', 'corn', 'rice', 'granos', 'granos enteros'],
    'Soya': ['soya', 'soja', 'soja', 'glycine max', 'soy', 'soja', 'soya texturizada', 'proteína de soya'],
    'Papa': ['papa', 'patata', 'solanum tuberosum', 'potato', 'papas', 'patatas'],
    'Camote': ['camote', 'batata', 'papa dulce', 'ipomoea batatas', 'sweet potato', 'boniatos'],
    'Legumbres': ['legumbres', 'lentejas', 'garbanzos', 'frijoles', 'judías', 'alubias', 'legumes', 'beans', 'lentils', 'leguminosas'],
    'Aceites vegetales': ['aceite vegetal', 'aceite de soja', 'aceite de maíz', 'aceite de girasol', 'aceite de canola', 'vegetable oil', 'aceites refinados']
  };

  // Mapeo de objetivos nutricionales y sus sinónimos
  const objetivosMap = {
    'Control de peso': ['control de peso', 'peso', 'adelgazar', 'obesidad', 'sobrepeso', 'weight control', 'weight management', 'bajo en calorías', 'mantenimiento de peso', 'dieta', 'reducir peso'],
    'Aumento de energía o masa muscular': ['energía', 'masa muscular', 'proteína', 'musculo', 'energetico', 'energy', 'muscle', 'protein', 'fortalecimiento', 'desarrollo muscular', 'ganancia muscular', 'alto en proteína'],
    'Apoyo Digestivo': ['digestión', 'digestivo', 'sensible', 'prebiótico', 'probiótico', 'fibra', 'digest', 'sensitive stomach', 'digestive health', 'salud intestinal', 'flora intestinal', 'probióticos'],
    'Piel y pelaje saludables': ['piel', 'pelaje', 'brillante', 'saludable', 'dermatológico', 'caspa', 'picor', 'skin', 'coat', 'fur', 'pelage', 'pelo brillante', 'dermatitis', 'omega', 'ácidos grasos'],
    'Soporte articular o movilidad': ['articular', 'movilidad', 'articulaciones', 'cartílago', 'artritis', 'huesos', 'joint', 'mobility', 'arthritis', 'condroitín', 'glucosamina', 'flexibilidad'],
    'Soporte inmunológico': ['inmunológico', 'defensas', 'inmunidad', 'resistencia a enfermedades', 'immune', 'defense', 'immunity', 'sistema inmunitario', 'anticuerpos', 'defensas naturales'],
    'Vitalidad y longevidad': ['vitalidad', 'longevidad', 'vejez', 'anciano', 'senior', 'vital', 'longevity', 'vitality', 'adulto mayor', 'tercera edad', 'envejecimiento saludable'],
    'Control del nivel de azúcar': ['azúcar', 'glucosa', 'diabetes', 'insulina', 'control de azúcar', 'sugar', 'glucose', 'diabetic', 'nivel glucémico', 'glicemia', 'bajo en azúcar']
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
      .trim() || '';
  };

  // Función mejorada para verificar alergias
  const contieneAlergenos = (producto, alergias) => {
    if (!alergias || alergias.length === 0) return false;
    
    const descripcion = normalizeText(producto.descripcion || producto.Descripcion || '');
    const nombre = normalizeText(producto.nombre || producto.Nombre || '');
    const ingredientes = normalizeText(producto.ingredientes || producto.Ingredientes || '');
    const categoria = normalizeText(producto.categoria || producto.Categoria || '');
    
    const textoCompleto = `${descripcion} ${nombre} ${ingredientes} ${categoria}`;

    return alergias.some(alergia => {
      const sinonimos = alergiasMap[alergia] || [normalizeText(alergia)];
      return sinonimos.some(sinonimo => 
        textoCompleto.includes(normalizeText(sinonimo))
      );
    });
  };

  // Función mejorada para calcular puntuación de objetivos
  const calcularPuntuacionObjetivos = (producto, objetivos) => {
    if (!objetivos || objetivos.length === 0) return 0;
    
    const descripcion = normalizeText(producto.descripcion || producto.Descripcion || '');
    const nombre = normalizeText(producto.nombre || producto.Nombre || '');
    const beneficios = normalizeText(producto.beneficios || producto.Beneficios || '');
    const categoria = normalizeText(producto.categoria || producto.Categoria || '');
    
    const textoCompleto = `${descripcion} ${nombre} ${beneficios} ${categoria}`;

    return objetivos.reduce((puntuacion, objetivo) => {
      const sinonimos = objetivosMap[objetivo] || [normalizeText(objetivo)];
      const encontrado = sinonimos.some(sinonimo => 
        textoCompleto.includes(normalizeText(sinonimo))
      );
      return puntuacion + (encontrado ? 1 : 0);
    }, 0);
  };

  // Mensaje de bienvenida inicial
  useEffect(() => {
    if (showChatbot && conversation.length === 0) {
      const welcomeMessage = {
        type: 'bot',
        content: user 
          ? `¡Hola ${user.name}! 👋 Soy Coco, tu asistente virtual de Patitas y Sabores.\n\nPuedo ayudarte a encontrar productos perfectos para tus mascotas y ofrecerte recomendaciones personalizadas. ¿Por dónde empezamos?`
          : '¡Hola! 👋 Soy Coco, tu asistente virtual de Patitas y Sabores.\n\nPuedo ayudarte a encontrar productos perfectos para tus mascotas y ofrecerte recomendaciones personalizadas. ¿Por dónde empezamos?',
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
    }, 1000);
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
      }, 1500);
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
      const alergias = mascota.alergias || [];
      const objetivos = mascota.objetivosNutricionales || [];

      // Lógica mejorada de recomendación
      const productosFiltrados = products.filter(producto => {
        // Excluir productos con alergenos
        if (contieneAlergenos(producto, alergias)) {
          return false;
        }
        return true;
      });

      const productosRecomendados = productosFiltrados
        .map(producto => {
          // Calcular puntuación basada en objetivos
          const puntuacionObjetivos = calcularPuntuacionObjetivos(producto, objetivos);
          const esPremium = normalizeText(producto.nombre).includes('premium') || 
                           normalizeText(producto.categoria).includes('premium') ||
                           normalizeText(producto.descripcion).includes('premium');
          
          // Puntuación adicional por características específicas
          let puntuacionExtra = 0;
          if (mascota.especie && normalizeText(producto.descripcion).includes(normalizeText(mascota.especie))) {
            puntuacionExtra += 1;
          }
          if (mascota.raza && normalizeText(producto.descripcion).includes(normalizeText(mascota.raza))) {
            puntuacionExtra += 0.5;
          }
          
          return {
            ...producto,
            puntuacion: (puntuacionObjetivos * 2) + (esPremium ? 1 : 0) + puntuacionExtra
          };
        })
        .sort((a, b) => b.puntuacion - a.puntuacion || (b.precio || 0) - (a.precio || 0))
        .slice(0, 3);

      if (productosRecomendados.length === 0) {
        let mensaje = `Basado en el perfil de ${nombre}`;
        if (alergias.length > 0) {
          mensaje += ` (evitando: ${alergias.join(', ')})`;
        }
        if (objetivos.length > 0) {
          mensaje += `, buscando: ${objetivos.join(', ')}`;
        }
        mensaje += `, actualmente no tengo recomendaciones específicas disponibles. Te sugiero explorar nuestra sección completa de productos.`;

        addMessage(
          mensaje,
          'bot',
          [
            { label: '🛍️ Explorar Productos', action: 'productos' },
            { label: '💬 Menú Principal', action: 'inicio' }
          ]
        );
        return;
      }

      let mensajeRecomendacion = `Basándome en el perfil de **${nombre}**`;
      if (alergias.length > 0) {
        mensajeRecomendacion += ` (evitando: ${alergias.join(', ')})`;
      }
      if (objetivos.length > 0) {
        mensajeRecomendacion += `, buscando: ${objetivos.join(', ')}`;
      }
      mensajeRecomendacion += `, he seleccionado estos productos perfectos:`;

      addMessage(mensajeRecomendacion, 'bot');

      productosRecomendados.forEach((producto, index) => {
        setTimeout(() => {
          addMessage('', 'bot', { type: 'product', product: producto });
        }, index * 600);
      });

      setTimeout(() => {
        addMessage(
          '¿Te gustaría explorar más productos o necesitas otra recomendación?',
          'bot',
          [
            { label: '🛍️ Ver Más Productos', action: 'productos' },
            { label: '🎯 Otra Recomendación', action: 'recomendaciones' },
            { label: '💬 Menú Principal', action: 'inicio' }
          ]
        );
      }, productosRecomendados.length * 600 + 1000);

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

    const productBatches = [];
    for (let i = 0; i < sortedProducts.length; i += 2) {
      productBatches.push(sortedProducts.slice(i, i + 2));
    }

    productBatches.forEach((batch, batchIndex) => {
      setTimeout(() => {
        batch.forEach(product => {
          addMessage('', 'bot', { type: 'product', product });
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
      }, batchIndex * 800);
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

  // Componente ProductCard mejorado con manejo robusto de imágenes
  const ProductCard = ({ product }) => {
    const nombre = product.nombre || product.Nombre || 'Sin nombre';
    const precio = (product.precio ?? product.Precio) !== undefined ? (product.precio ?? product.Precio) : null;
    
    // Manejo robusto de imágenes
    const getProductImage = () => {
      const posiblesPropiedades = [
        'imagen', 'Imagen', 'imagenURL', 'imagenUrl', 'urlImagen', 
        'image', 'Image', 'imageURL', 'imageUrl', 'urlImage',
        'foto', 'Foto', 'fotoURL', 'fotoUrl', 'urlFoto',
        'img', 'Img', 'imgURL', 'imgUrl', 'urlImg'
      ];
      
      for (let prop of posiblesPropiedades) {
        if (product[prop] && typeof product[prop] === 'string' && product[prop].trim() !== '') {
          const url = product[prop].trim();
          
          // Si es una URL completa o data URL
          if (url.startsWith('http') || url.startsWith('//') || url.startsWith('data:')) {
            return url;
          }
          
          // Si es una ruta relativa
          if (url.startsWith('./') || url.startsWith('../') || url.startsWith('/')) {
            return url;
          }
          
          // Si no tiene prefijo, asumimos que es una ruta relativa desde la raíz
          return `/${url}`;
        }
      }
      return null;
    };

    const imagen = getProductImage();

    return (
      <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
        <Card 
          sx={{ 
            mb: 2, 
            border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
            borderRadius: 3,
            background: colorPalette.surface,
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.02)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Imagen del producto - Mejorada */}
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                {imagen ? (
                  <Avatar 
                    src={imagen}
                    onError={(e) => {
                      console.log('Error loading image:', imagen);
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'flex';
                      }
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
                ) : null}
                <Avatar 
                  sx={{ 
                    width: 70, 
                    height: 70,
                    borderRadius: 2,
                    backgroundColor: colorPalette.accent,
                    border: `2px solid ${colorPalette.primary}`,
                    display: imagen ? 'none' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} 
                  variant="rounded"
                >
                  <LocalOfferIcon sx={{ color: colorPalette.text, fontSize: 30 }} />
                </Avatar>
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
      </Zoom>
    );
  };

  const QuickReplies = ({ options }) => (
    <Fade in timeout={600} style={{ transitionDelay: '300ms' }}>
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
                transform: 'scale(1.08)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '0.8rem',
              height: 32,
              animation: `fadeInUp 0.5s ease-out ${index * 100}ms both`
            }}
          />
        ))}
      </Box>
    </Fade>
  );

  const MessageBubble = ({ message, index }) => (
    <Slide in direction="up" timeout={800} style={{ transitionDelay: `${index * 150}ms` }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
          mb: 2,
          animation: `messageSlideIn 0.6s ease-out ${index * 150}ms both`
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
                border: `2px solid ${colorPalette.primary}`,
                animation: 'bounceIn 0.8s ease-out'
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
              lineHeight: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }
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
    </Slide>
  );

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
            Coco Assistant
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
    <Fade in timeout={600}>
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

  // Agregar estilos CSS para animaciones personalizadas
  const styles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes messageSlideIn {
      from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
  `;

  if (!showChatbot) {
    return (
      <>
        <style>{styles}</style>
        <Tooltip title="¡Habla con Coco!" placement="left" arrow>
          <Zoom in timeout={800}>
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
                  transform: 'scale(1.15) rotate(5deg)',
                  boxShadow: `0 6px 25px ${alpha(colorPalette.primary, 0.4)}`,
                  animation: 'pulse 2s infinite'
                },
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 1000
              }}
            >
              <Box
                component="img"
                src="/assets/chatbot.png"
                alt="Coco Assistant"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  transition: 'transform 0.3s ease'
                }}
              />
            </Fab>
          </Zoom>
        </Tooltip>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <Slide in direction="up" timeout={600}>
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
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
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
      </Slide>
    </>
  );
};

export default ChatbotComponent;