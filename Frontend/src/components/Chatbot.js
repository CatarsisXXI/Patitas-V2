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
    primary: '#A8D8EA', // Azul pastel suave
    secondary: '#FFAAA7', // Rosa pastel suave
    accent: '#FFD3B5', // Melocotón pastel
    background: '#FAFAFA', // Blanco casi puro
    surface: '#FFFFFF', // Blanco puro
    text: '#424242', // Gris oscuro suave
    textLight: '#757575', // Gris medio
    userBubble: '#E3F2FD', // Azul muy claro
    botBubble: '#F5F5F5', // Gris muy claro
    success: '#C8E6C9', // Verde pastel
    warning: '#FFECB3' // Amarillo pastel
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

    // Simular tiempo de procesamiento
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

    // Solo una mascota
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
      
      // Obtener productos recomendados basados en el perfil de la mascota
      const productosRecomendados = products
        .filter(p => p.categoria?.toLowerCase().includes('snack') || p.nombre?.toLowerCase().includes('premium'))
        .sort((a, b) => (b.precio || 0) - (a.precio || 0)) // Ordenar por precio descendente
        .slice(0, 3);

      if (productosRecomendados.length === 0) {
        addMessage(
          `Basado en el perfil de ${nombre}, actualmente no tengo recomendaciones específicas disponibles. Te sugiero explorar nuestra sección completa de productos.`,
          'bot',
          [
            { label: '🛍️ Explorar Productos', action: 'productos' },
            { label: '💬 Menú Principal', action: 'inicio' }
          ]
        );
        return;
      }

      addMessage(
        `Basándome en el perfil de **${nombre}**, he seleccionado estos productos que podrían ser perfectos:`,
        'bot'
      );

      // Añadir productos recomendados con mejor formato
      productosRecomendados.forEach((producto, index) => {
        setTimeout(() => {
          addMessage('', 'bot', { type: 'product', product: producto });
        }, index * 600);
      });

      // Opciones después de mostrar recomendaciones
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

    // Ordenar productos: primero por categoría, luego por precio
    const sortedProducts = [...products].sort((a, b) => {
      // Ordenar por categoría primero
      const catA = a.categoria || 'Otros';
      const catB = b.categoria || 'Otros';
      if (catA !== catB) return catA.localeCompare(catB);
      
      // Luego por precio (mayor a menor)
      return (b.precio || 0) - (a.precio || 0);
    });

    // Mostrar productos en lotes de 2 para mejor experiencia
    const productBatches = [];
    for (let i = 0; i < sortedProducts.length; i += 2) {
      productBatches.push(sortedProducts.slice(i, i + 2));
    }

    productBatches.forEach((batch, batchIndex) => {
      setTimeout(() => {
        batch.forEach(product => {
          addMessage('', 'bot', { type: 'product', product });
        });
        
        // Si es el último lote, mostrar opciones
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

  const ProductCard = ({ product }) => {
    const nombre = product.nombre || product.Nombre || 'Sin nombre';
    const precio = (product.precio ?? product.Precio) !== undefined ? (product.precio ?? product.Precio) : null;
    const imagen = product.imagen || product.Imagen || product.imagenURL;

    return (
      <Zoom in>
        <Card 
          sx={{ 
            mb: 2, 
            border: `1px solid ${alpha(colorPalette.primary, 0.2)}`,
            borderRadius: 3,
            background: colorPalette.surface,
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
            }
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Imagen del producto */}
              {imagen ? (
                <Avatar 
                  src={imagen} 
                  sx={{ 
                    width: 60, 
                    height: 60,
                    borderRadius: 2,
                    border: `2px solid ${colorPalette.primary}`,
                    flexShrink: 0
                  }} 
                  variant="rounded"
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60,
                    borderRadius: 2,
                    backgroundColor: colorPalette.accent,
                    border: `2px solid ${colorPalette.primary}`,
                    flexShrink: 0
                  }} 
                  variant="rounded"
                >
                  <LocalOfferIcon sx={{ color: colorPalette.text }} />
                </Avatar>
              )}
              
              {/* Información del producto */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
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
                      WebkitBoxOrient: 'vertical'
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
                        ml: 1,
                        flexShrink: 0,
                        height: 24
                      }}
                    />
                  )}
                </Box>
                
                {/* Botones compactos */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => handleProductAction(product, 'view')}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      fontSize: '0.7rem',
                      borderColor: colorPalette.primary,
                      color: colorPalette.primary,
                      '&:hover': {
                        backgroundColor: alpha(colorPalette.primary, 0.1),
                        borderColor: colorPalette.primary
                      },
                      minWidth: 'auto',
                      px: 1.5,
                      height: 28
                    }}
                  >
                    Detalles
                  </Button>
                  <Button
                    onClick={() => handleProductAction(product, 'buy')}
                    variant="contained"
                    size="small"
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
      </Zoom>
    );
  };

  const QuickReplies = ({ options }) => (
    <Fade in timeout={500}>
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
                backgroundColor: alpha(colorPalette.primary, 0.1),
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease',
              fontSize: '0.8rem',
              height: 32
            }}
          />
        ))}
      </Box>
    </Fade>
  );

  const MessageBubble = ({ message, index }) => (
    <Slide in direction="up" timeout={500 + index * 100}>
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
    <Fade in>
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
                  backgroundColor: alpha(colorPalette.primary, 0.2)
                },
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
      <Tooltip title="¡Habla con Coco!" placement="left" arrow>
        <Zoom in>
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
              alt="Coco Assistant"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%'
              }}
            />
          </Fab>
        </Zoom>
      </Tooltip>
    );
  }

  return (
    <Slide in direction="up" timeout={500}>
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
          zIndex: 1000,
          transition: 'all 0.3s ease'
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
  );
};

export default ChatbotComponent;