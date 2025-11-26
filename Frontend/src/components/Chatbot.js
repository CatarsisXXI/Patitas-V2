import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Chatbot from 'react-chatbot-kit';
import { createChatBotMessage } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { Fab, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import mascotaService from '../services/mascotaService';
import productService from '../services/productService';

const ChatbotComponent = () => {
  const [showChatbot, setShowChatbot] = useState(true);
  const [mascotas, setMascotas] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Helper functions
  const getMascotaId = useCallback((m) => 
    (m && (m.MascotaID ?? m.mascotaID ?? m.id ?? m.idMascota ?? m.id_mascota)), []);

  const getMascotaNombre = useCallback((m) => 
    (m?.nombre || m?.Nombre || 'tu mascota'), []);

  const whatsappNumber = '51956550376';

  // Data fetching
  useEffect(() => {
    if (user) {
      fetchMascotas();
    }
  }, [user]);

  const fetchMascotas = async () => {
    try {
      setIsLoading(true);
      const data = await mascotaService.getMascotas();
      setMascotas(data || []);
    } catch (error) {
      console.error('Error fetching mascotas:', error);
      setMascotas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProductos();
      setProducts(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Comprehensive allergy and synonym mapping
  const getAllergySynonyms = () => ({
    'pollo': ['pollo', 'ave', 'gallina', 'pava', 'carne de ave', 'carne ave', 'pollito'],
    'cereales': ['cereales', 'trigo', 'avena', 'cebada', 'centeno', 'maíz', 'arroz', 'gluten', 'harina', 'grano', 'granos', 'cereal'],
    'soya': ['soya', 'soja', 'soja', 'glycine max', 'leguminosa', 'soja texturizada'],
    'papa': ['papa', 'patata', 'solánum tuberósum', 'tubérculo', 'papa blanca'],
    'camote': ['camote', 'batata', 'boniato', 'ipomoea batatas', 'dulce', 'camote dulce'],
    'legumbres': ['legumbres', 'leguminosas', 'frijol', 'habas', 'lentejas', 'garbanzos', 'judías', 'poroto', 'alubia', 'legumbre'],
    'aceites vegetales': ['aceite vegetal', 'aceite de oliva', 'aceite oliva', 'oliva', 'aceite de girasol', 'aceite girasol', 'aceite de linaza', 'aceite linaza', 'aceite de maíz', 'aceite maíz', 'aceite vegetal refinado']
  });

  // Nutritional objectives mapping with synonyms and expected products
  const getNutritionalObjectivesMapping = () => ({
    'control de peso': {
      keywords: ['control peso', 'peso', 'light', 'bajo calorías', 'bajo en calorías', 'adelgazar', 'dieta', 'reducir peso', 'mantenimiento peso', 'fibra', 'saciedad'],
      expectedProducts: ['Dermosalud', 'Yacon Light', 'Yacón Light']
    },
    'aumento de energía o masa muscular': {
      keywords: ['energía', 'masa muscular', 'muscular', 'proteína', 'fuerza', 'rendimiento', 'actividad', 'ejercicio', 'desarrollo muscular'],
      expectedProducts: ['Yacon Light', 'Yacón Light', 'CarobFibra', 'Carob Fibra']
    },
    'apoyo digestivo (digestión sensible)': {
      keywords: ['digestivo', 'digestión', 'sensible', 'estómago', 'intestinal', 'fibra', 'probiotico', 'prebiótico', 'digestivo', 'sensibilidad'],
      expectedProducts: ['Digest Fit', 'CarobFibra', 'Carob Fibra', 'Yacon Light', 'Yacón Light']
    },
    'piel y pelaje saludables': {
      keywords: ['piel', 'pelaje', 'dermosalud', 'dermatológico', 'brillo', 'caída pelo', 'omega', 'grasa saludable', 'derma', 'cutáneo'],
      expectedProducts: ['Dermosalud', 'Digest Fit', 'Vital Omega Crunch', 'Omega Crunch']
    },
    'soporte articular o movilidad': {
      keywords: ['articular', 'articulaciones', 'movilidad', 'huesos', 'cartílago', 'flexibilidad', 'artritis', 'articulación', 'movimiento'],
      expectedProducts: ['Yacon Light', 'Yacón Light', 'CarobFibra', 'Carob Fibra', 'Vital Omega Crunch', 'Omega Crunch']
    },
    'soporte inmunológico': {
      keywords: ['inmunológico', 'inmunidad', 'defensas', 'sistema inmune', 'protección', 'anticuerpos', 'inmune', 'defensa'],
      expectedProducts: ['CarobFibra', 'Carob Fibra', 'Digest Fit', 'Yacon Light', 'Yacón Light']
    },
    'vitalidad y longevidad': {
      keywords: ['vitalidad', 'longevidad', 'vejez', 'senior', 'adulto mayor', 'energía vital', 'calidad vida', 'envejecimiento', 'vital'],
      expectedProducts: ['Digest Fit', 'Vital Omega Crunch', 'Omega Crunch']
    },
    'control del nivel de azúcar': {
      keywords: ['azúcar', 'glucosa', 'diabetes', 'insulina', 'nivel azúcar', 'control glucémico', 'glicemia', 'azúcar en sangre'],
      expectedProducts: ['Yacon Light', 'Yacón Light']
    }
  });

  // Activity level mapping
  const getActivityLevelMapping = () => ({
    'sedentario': ['Digest Fit', 'Yacon Light', 'Yacón Light', 'Vital Omega Crunch', 'Omega Crunch'],
    'moderadamente activo': [], // No specific restrictions
    'muy activo': ['Yacon Light', 'Yacón Light', 'CarobFibra', 'Carob Fibra']
  });

  // Age mapping - ONLY FOR SENIOR
  const getSeniorProducts = () => [
    'Digest Fit', 
    'Yacon Light', 
    'Yacón Light', 
    'Vital Omega Crunch', 
    'Omega Crunch'
  ];

  // Improved product recommendation logic with hierarchical priority
  const getProductRecommendations = useCallback((mascota, allProducts) => {
    if (!allProducts || allProducts.length === 0) return [];
    
    const notas = mascota.notasAdicionales?.toLowerCase() || '';
    
    // Extract information from notes
    const alergias = extractSection(notas, 'Alergias');
    const objetivos = extractSection(notas, 'Objetivo nutricional');
    const nivelActividad = extractSection(notas, 'Nivel de actividad')[0] || 'moderadamente activo';
    const edad = extractSection(notas, 'Edad')[0] || '';
    
    const objetivoPrincipal = (objetivos[0] || 'mantenimiento general').trim().toLowerCase();

    // Determine if senior (age > 7 years)
    const esSenior = isMascotaSenior(edad, mascota);

    // Get mappings
    const allergySynonyms = getAllergySynonyms();
    const nutritionalMapping = getNutritionalObjectivesMapping();
    const activityMapping = getActivityLevelMapping();
    const seniorProducts = getSeniorProducts();

    // STEP 1: FILTER BY ALLERGIES (HIGHEST PRIORITY)
    const safeProducts = allProducts.filter(product => {
      const productText = `${product.descripcion || ''} ${product.nombre || ''} ${product.ingredientes || ''}`.toLowerCase();
      
      // Check if product contains any allergen
      const hasAllergen = alergias.some(alergia => {
        const synonyms = allergySynonyms[alergia] || [alergia];
        return synonyms.some(synonym => 
          productText.includes(synonym.toLowerCase())
        );
      });

      return !hasAllergen;
    });

    if (safeProducts.length === 0) {
      console.warn('No safe products found after allergy filtering');
      return [];
    }

    // STEP 2: SCORE BY NUTRITIONAL OBJECTIVES (SECOND PRIORITY)
    const nutritionScoredProducts = safeProducts.map(product => {
      let score = 0;
      const productText = `${product.nombre || ''} ${product.descripcion || ''}`.toLowerCase();
      const productName = product.nombre || '';
      
      // Nutritional objective scoring
      const objectiveConfig = nutritionalMapping[objetivoPrincipal];
      if (objectiveConfig) {
        // Score for keywords in product text
        objectiveConfig.keywords.forEach(keyword => {
          if (productText.includes(keyword.toLowerCase())) {
            score += 2;
          }
        });
        
        // Bonus for expected products by name
        if (objectiveConfig.expectedProducts.some(expected => 
          productName.toLowerCase().includes(expected.toLowerCase())
        )) {
          score += 3;
        }
      }

      return { product, score, productName, productText };
    });

    // STEP 3: FILTER BY ACTIVITY LEVEL (THIRD PRIORITY)
    const activityFilteredProducts = nutritionScoredProducts.filter(item => {
      const activityProducts = activityMapping[nivelActividad] || [];
      
      // If no specific activity products, include all
      if (activityProducts.length === 0) return true;
      
      // Check if product matches activity level
      return activityProducts.some(activityProd => 
        item.productName.toLowerCase().includes(activityProd.toLowerCase())
      );
    });

    // STEP 4: APPLY SENIOR PREFERENCE (ONLY IF SENIOR)
    let finalScoredProducts = activityFilteredProducts.map(item => {
      let finalScore = item.score;
      
      // Add senior bonus if applicable
      if (esSenior) {
        const isSeniorProduct = seniorProducts.some(seniorProd => 
          item.productName.toLowerCase().includes(seniorProd.toLowerCase())
        );
        if (isSeniorProduct) {
          finalScore += 2; // Bonus for senior-appropriate products
        }
      }

      return { ...item, finalScore };
    });

    // Sort by final score and return top recommendations
    const sortedProducts = finalScoredProducts
      .sort((a, b) => b.finalScore - a.finalScore)
      .map(item => item.product);

    // Return results - if no high-scoring products, return safe products
    return sortedProducts.length > 0 ? sortedProducts.slice(0, 5) : safeProducts.slice(0, 3);
  }, []);

  // Helper function to determine if mascota is senior
  const isMascotaSenior = (edadText, mascota) => {
    // Try to extract numeric age from text
    const edadMatch = edadText.match(/(\d+)/);
    if (edadMatch) {
      const edadNum = parseInt(edadMatch[0]);
      return edadNum > 7;
    }
    
    // Check for senior keywords
    const seniorKeywords = ['senior', 'viejo', 'anciano', 'mayor', 'adulto mayor'];
    if (seniorKeywords.some(keyword => edadText.includes(keyword))) {
      return true;
    }
    
    // Check mascota object directly for age
    const mascotaEdad = mascota.edad || mascota.Edad;
    if (mascotaEdad && typeof mascotaEdad === 'number') {
      return mascotaEdad > 7;
    }
    
    return false;
  };

  const extractSection = (text, label) => {
    const regex = new RegExp(`${label}:([^|]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].split(',').map(s => s.trim().toLowerCase()) : [];
  };

  // Rest of the component remains the same...
  const config = useMemo(() => ({
    initialMessages: [
      createChatBotMessage('¡Hola! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?', {
        widget: 'mainOptions',
      }),
    ],
    botName: 'Coco',
    inputDisabled: true,
    widgets: [
      {
        widgetName: 'mainOptions',
        widgetFunc: (props) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            <button
              onClick={() => handleWidgetAction(props, 'recomendaciones')}
              style={buttonStyle}
            >
              Recomendaciones Personalizadas
            </button>
            <button
              onClick={() => handleWidgetAction(props, 'productos')}
              style={buttonStyle}
            >
              Ver Todos los Productos
            </button>
          </div>
        ),
      },
      {
        widgetName: 'mascotaOptions',
        widgetFunc: (props) => {
          const mascotaList = props.widgetProps?.mascotas || mascotas || [];
          
          if (mascotaList.length === 0) {
            return (
              <div style={{ padding: '8px', color: '#666', fontStyle: 'italic' }}>
                No hay mascotas registradas
              </div>
            );
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {mascotaList.map((mascota) => {
                const id = getMascotaId(mascota);
                const nombre = getMascotaNombre(mascota);
                const especie = mascota.especie || mascota.Especie || 'sin especie';
                const edad = mascota.edad || extractSection(mascota.notasAdicionales?.toLowerCase() || '', 'Edad')[0] || '';

                return (
                  <button
                    key={id || `${nombre}_${Math.random()}`}
                    onClick={() => handleWidgetAction(props, `seleccionar_mascota_${id}`)}
                    style={buttonStyle}
                  >
                    {`${nombre} (${especie})${edad ? ` - ${edad}` : ''}`}
                  </button>
                );
              })}
            </div>
          );
        },
      },
      {
        widgetName: 'productCards',
        widgetFunc: ({ payload }) => {
          const productList = Array.isArray(payload) ? payload : [];
          
          if (productList.length === 0) {
            return (
              <div style={{ padding: '8px', color: '#666' }}>
                No se encontraron productos que cumplan con los requisitos de alergias y objetivos nutricionales.
              </div>
            );
          }

          return (
            <div style={productContainerStyle}>
              {productList.map((product, index) => (
                <ProductCard 
                  key={product.id || product.productoID || index}
                  product={product}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          );
        },
      }
    ],
    customStyles: {
      botMessageBox: {
        backgroundColor: '#A8B5A0',
        color: '#000',
      },
      userMessageBox: {
        backgroundColor: '#D4A574',
        color: '#000',
      },
      chatButton: {
        backgroundColor: '#A8B5A0',
      },
    },
    customComponents: {
      botAvatar: (props) => (
        <div {...props}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/005/055/092/non_2x/cute-australian-shepherd-dog-avatar-cartoon-icon-illustration-vector.jpg"
            alt="Coco Bot"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        </div>
      ),
      input: () => null,
      quickReply: (props) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          {props.quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => props.onQuickReply(reply.value)}
              style={quickReplyButtonStyle}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#8FA68E')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#A8B5A0')}
            >
              {reply.label}
            </button>
          ))}
        </div>
      ),
    },
  }), [mascotas, getMascotaId, getMascotaNombre]);

  // Action Provider with improved logic
  const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    
    const updateChatState = useCallback((newMessages) => {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, ...(Array.isArray(newMessages) ? newMessages : [newMessages])]
      }));
    }, []);

    const sendOptions = useCallback(() => {
      const optionsMsg = createChatBotMessage('¿En qué más puedo ayudarte?', {
        widget: 'mainOptions',
      });
      
      setTimeout(() => {
        updateChatState(optionsMsg);
      }, 1000);
    }, [createChatBotMessage, updateChatState]);

    const handleRecommendationsForMascota = useCallback(async (mascotaId) => {
      const mascota = mascotas.find(m => String(getMascotaId(m)) === String(mascotaId));
      
      if (!mascota) {
        const message = createChatBotMessage('No pude encontrar la mascota seleccionada. Intenta de nuevo.');
        updateChatState(message);
        return;
      }

      try {
        const allProducts = await fetchProducts();
        
        if (!allProducts || allProducts.length === 0) {
          const message = createChatBotMessage('Lo siento, no hay productos disponibles para recomendar en este momento.');
          updateChatState(message);
          return;
        }

        const recommendedProducts = getProductRecommendations(mascota, allProducts);
        const mascotaNombre = getMascotaNombre(mascota);

        // Extract info for personalized message
        const notas = mascota.notasAdicionales?.toLowerCase() || '';
        const alergias = extractSection(notas, 'Alergias');
        const objetivos = extractSection(notas, 'Objetivo nutricional');
        const objetivoPrincipal = (objetivos[0] || 'mantenimiento general').trim();
        const esSenior = isMascotaSenior(extractSection(notas, 'Edad')[0] || '', mascota);

        if (recommendedProducts.length === 0) {
          const message = createChatBotMessage(
            `No encontré productos adecuados para ${mascotaNombre} que cumplan con sus alergias (${alergias.join(', ')}) y objetivo de ${objetivoPrincipal}. Te recomiendo consultar con nuestro equipo para opciones especiales.`
          );
          updateChatState(message);
          sendOptions();
          return;
        }

        // Create personalized recommendation message
        let personalizedMessage = `¡Perfecto! Para ${mascotaNombre} `;
        
        if (alergias.length > 0) {
          personalizedMessage += `(evitando: ${alergias.join(', ')}) `;
        }
        
        personalizedMessage += `con objetivo de ${objetivoPrincipal} `;
        
        if (esSenior) {
          personalizedMessage += `y considerando su edad senior, `;
        }
        
        personalizedMessage += `he seleccionado estos productos:`;

        const introMessage = createChatBotMessage(personalizedMessage);

        const productMessage = createChatBotMessage(
          `Encontré ${recommendedProducts.length} producto(s) ideales para ${mascotaNombre}:`,
          {
            widget: 'productCards',
            payload: recommendedProducts,
          }
        );

        updateChatState([introMessage, productMessage]);
        sendOptions();

      } catch (error) {
        console.error('Error generating recommendations:', error);
        const message = createChatBotMessage('Ocurrió un error al generar las recomendaciones. Inténtalo de nuevo.');
        updateChatState(message);
        sendOptions();
      }
    }, [mascotas, getProductRecommendations, getMascotaNombre, getMascotaId, createChatBotMessage, updateChatState, sendOptions]);

    // Rest of ActionProvider remains the same...
    const handleRecommendations = useCallback(() => {
      if (!mascotas || mascotas.length === 0) {
        const message = createChatBotMessage(
          <span style={{ color: '#886137', fontWeight: 'bold' }}>
            No tienes mascotas registradas. ¡Registra a tu mascota en la sección de Mascotas para recibir recomendaciones personalizadas!
          </span>
        );
        updateChatState(message);
        sendOptions();
        return;
      }

      if (mascotas.length > 1) {
        const askMessage = createChatBotMessage('Tienes varias mascotas registradas. ¿Para cuál deseas la recomendación?', {
          widget: 'mascotaOptions',
          widgetProps: { mascotas },
        });
        updateChatState(askMessage);
        return;
      }

      // Single mascota case
      const mascota = mascotas[0];
      handleRecommendationsForMascota(getMascotaId(mascota));
    }, [mascotas, handleRecommendationsForMascota, getMascotaId, createChatBotMessage, updateChatState, sendOptions]);

    const handleProductos = useCallback(async () => {
      try {
        const allProducts = await fetchProducts();
        
        if (!allProducts || allProducts.length === 0) {
          const message = createChatBotMessage('No hay productos disponibles en este momento.');
          updateChatState(message);
          sendOptions();
          return;
        }

        const productMessage = createChatBotMessage(
          `¡Aquí tienes todos nuestros productos disponibles! Tenemos ${allProducts.length} producto(s) para ti:`,
          {
            widget: 'productCards',
            payload: allProducts.slice(0, 15),
          }
        );

        updateChatState(productMessage);
        sendOptions();

      } catch (error) {
        console.error('Error getting products:', error);
        const message = createChatBotMessage('Lo siento, hubo un error al obtener la lista de productos. Inténtalo de nuevo.');
        updateChatState(message);
        sendOptions();
      }
    }, [createChatBotMessage, updateChatState, sendOptions]);

    useEffect(() => {
      const greetingText = user
        ? `¡Hola ${user.name}! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?`
        : '¡Hola! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?';

      const greeting = createChatBotMessage(greetingText, {
        widget: 'mainOptions',
      });

      setState(prev => {
        const hasGreeting = prev.messages.some(m => 
          m.message?.includes?.('¿En qué puedo ayudarte hoy?')
        );
        return hasGreeting ? prev : { ...prev, messages: [...prev.messages, greeting] };
      });
    }, [user, createChatBotMessage, setState]);

    useEffect(() => {
      const handler = (e) => {
        const value = e?.detail;
        if (!value) return;

        const action = value.toString().toLowerCase();
        
        switch (action) {
          case 'recomendaciones':
            handleRecommendations();
            break;
          case 'productos':
            handleProductos();
            break;
          default:
            if (action.startsWith('seleccionar_mascota_')) {
              const mascotaId = action.replace('seleccionar_mascota_', '');
              handleRecommendationsForMascota(mascotaId);
            }
            break;
        }
      };

      window.addEventListener('chatbot-option', handler);
      return () => window.removeEventListener('chatbot-option', handler);
    }, [handleRecommendations, handleProductos, handleRecommendationsForMascota]);

    return (
      <div>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            key: index,
            actions: {
              handleRecommendations,
              handleProductos,
              handleRecommendationsForMascota,
            },
          })
        )}
      </div>
    );
  };

  // Rest of the component (MessageParser, styles, etc.) remains the same...
  const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
      if (!message) return;
      
      const msg = message.toString().toLowerCase();
      
      if (msg === 'recomendaciones' || msg === 'recomendacion') {
        actions.handleRecommendations();
      } else if (msg === 'productos') {
        actions.handleProductos();
      } else if (msg.startsWith('seleccionar_mascota_')) {
        const id = msg.replace('seleccionar_mascota_', '');
        actions.handleRecommendationsForMascota?.(id);
      }
    };

    return (
      <div>
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, {
            key: index,
            parse: parse,
            actions: actions,
          })
        )}
      </div>
    );
  };

  // Hide input field
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-chatbot-container input, 
      .custom-chatbot-container textarea, 
      .custom-chatbot-container .react-chatbot-kit-chat-input { 
        display: none !important; 
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!showChatbot) {
    return (
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setShowChatbot(true)}
        sx={fabStyle}
      >
        <img
          src="/assets/chatbot.png"
          alt="Coco Bot"
          style={{ width: '56px', height: '56px', borderRadius: '50%' }}
        />
      </Fab>
    );
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <Box sx={{ position: 'relative' }}>
        <Fab
          size="small"
          onClick={() => setShowChatbot(false)}
          sx={closeButtonStyle}
        >
          <CloseIcon />
        </Fab>
        <Box sx={{ width: 350, height: 500 }}>
          <div className="custom-chatbot-container">
            <Chatbot
              key={showChatbot ? 'open' : 'closed'}
              config={config}
              actionProvider={ActionProvider}
              messageParser={MessageParser}
            />
          </div>
        </Box>
      </Box>
    </Box>
  );
};

// Helper components and styles (remain the same)...
const ProductCard = ({ product, whatsappNumber }) => {
  const id = product.productoID || product.ProductoID || product.id || product.productId;
  const nombre = product.nombre || product.Nombre || product.NombreProducto || 'Sin nombre';
  const desc = product.descripcion || product.Descripcion || product.DescripcionCorta || '';
  const precio = (product.precio ?? product.Precio) !== undefined ? (product.precio ?? product.Precio) : null;

  const handleComprar = () => {
    const text = `Hola! Estoy interesado en comprar: ${nombre} ${precio ? `(S/${precio})` : ''}. Puedes coordinar conmigo?`;
    const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleVerDetalle = () => {
    if (id) window.location.href = `/productos/${id}`;
  };

  return (
    <div style={productCardStyle}>
      <div style={productNameStyle}>
        {nombre} {precio ? `- S/${precio}` : ''}
      </div>
      <div style={productDescriptionStyle}>
        {desc}
      </div>
      <div style={productActionsStyle}>
        <button onClick={handleVerDetalle} style={detailButtonStyle}>
          Ver detalle
        </button>
        <button onClick={handleComprar} style={buyButtonStyle}>
          Comprar
        </button>
      </div>
    </div>
  );
};

// Styles (remain the same)...
const buttonStyle = {
  backgroundColor: '#A8B5A0',
  color: '#000',
  border: 'none',
  borderRadius: 20,
  padding: '8px 12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  textAlign: 'left'
};

const quickReplyButtonStyle = {
  backgroundColor: '#A8B5A0',
  color: '#000',
  border: 'none',
  borderRadius: '20px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const productContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  marginTop: 8,
  maxWidth: '100%',
  overflowX: 'hidden'
};

const productCardStyle = {
  borderRadius: 8,
  padding: 8,
  border: '1px solid #ddd',
  background: '#fff',
  margin: '4px 0',
  width: '100%',
  boxSizing: 'border-box'
};

const productNameStyle = {
  fontWeight: 'bold',
  wordBreak: 'break-word'
};

const productDescriptionStyle = {
  fontSize: 12,
  color: '#444',
  marginTop: 6,
  wordBreak: 'break-word',
  maxHeight: '3em',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const productActionsStyle = {
  display: 'flex',
  gap: 8,
  marginTop: 8,
  flexWrap: 'wrap'
};

const detailButtonStyle = {
  backgroundColor: '#A8B5A0',
  color: '#000',
  border: 'none',
  borderRadius: 6,
  padding: '6px 10px',
  cursor: 'pointer',
  flex: '1 1 auto',
  minWidth: 'fit-content'
};

const buyButtonStyle = {
  backgroundColor: '#D4A574',
  color: '#000',
  border: 'none',
  borderRadius: 6,
  padding: '6px 10px',
  cursor: 'pointer',
  flex: '1 1 auto',
  minWidth: 'fit-content'
};

const fabStyle = {
  position: 'fixed',
  bottom: 16,
  right: 16,
  backgroundColor: '#A8B5A0',
  '&:hover': { backgroundColor: '#8FA68E' },
};

const closeButtonStyle = {
  position: 'absolute',
  top: -10,
  right: -10,
  backgroundColor: '#D4A574',
  '&:hover': { backgroundColor: '#C49A6A' },
};

const handleWidgetAction = (props, action) => {
  if (props.onQuickReply) return props.onQuickReply(action);
  if (props.widgetProps && props.widgetProps.handleSelectMascota && action.startsWith('seleccionar_mascota_')) {
    const mascotaId = action.replace('seleccionar_mascota_', '');
    return props.widgetProps.handleSelectMascota(mascotaId);
  }
  window.dispatchEvent(new CustomEvent('chatbot-option', { detail: action }));
};

export default ChatbotComponent;