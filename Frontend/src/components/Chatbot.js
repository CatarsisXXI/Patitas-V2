import React, { useState, useEffect, useMemo } from 'react';
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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMascotas();
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

  // helper to get mascota id from returned object (supports several shapes)
  const getMascotaId = (m) => (m && (m.MascotaID ?? m.mascotaID ?? m.id ?? m.idMascota ?? m.id_mascota));
  const whatsappNumber = '51956550376'; // +51 956550376 -> phone param without + or spaces

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
              onClick={() => {
                // Try onQuickReply / widgetProps for compatibility
                if (props.onQuickReply) return props.onQuickReply('recomendaciones');
                if (props.widgetProps && props.widgetProps.handleRecommendations) return props.widgetProps.handleRecommendations();
                // Fallback: dispatch a custom DOM event that ActionProvider will listen for
                window.dispatchEvent(new CustomEvent('chatbot-option', { detail: 'recomendaciones' }));
              }}
              style={{ backgroundColor: '#A8B5A0', color: '#000', border: 'none', borderRadius: 20, padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Recomendaciones
            </button>
            <button
              onClick={() => {
                if (props.onQuickReply) return props.onQuickReply('productos');
                if (props.widgetProps && props.widgetProps.handleProductos) return props.widgetProps.handleProductos();
                window.dispatchEvent(new CustomEvent('chatbot-option', { detail: 'productos' }));
              }}
              style={{ backgroundColor: '#A8B5A0', color: '#000', border: 'none', borderRadius: 20, padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Productos
            </button>

          </div>
        ),
      }
      ,
      {
        widgetName: 'mascotaOptions',
        widgetFunc: (props) => {
          const list = (props.widgetProps?.mascotas && props.widgetProps.mascotas.length) ? props.widgetProps.mascotas : mascotas || [];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {list.map((m) => {
                const id = getMascotaId(m) || m.mascotaID || m.MascotaID || m.id || m.idMascota || m.id_mascota;
                const nombre = m.nombre || m.Nombre || 'Sin nombre';
                const especie = (m.especie || m.Especie || '') || 'sin especie';
                return (
                  <button
                    key={id || `${nombre}_${Math.random()}`}
                    onClick={() => {
                      const token = `seleccionar_mascota_${id}`;
                      if (props.onQuickReply) return props.onQuickReply(token);
                      if (props.widgetProps && props.widgetProps.handleSelectMascota) return props.widgetProps.handleSelectMascota(id);
                      window.dispatchEvent(new CustomEvent('chatbot-option', { detail: token }));
                    }}
                    style={{ backgroundColor: '#A8B5A0', color: '#000', border: 'none', borderRadius: 20, padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {`${nombre} (${especie})`}
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
          console.log('Widget payload received:', payload); // Debug log
          
          // Get products directly from payload
          const list = Array.isArray(payload) ? payload : [];
          console.log('Product list:', list); // Debug log
          
          // If no products, show message
          if (!list || list.length === 0) {
            return <div style={{ padding: '8px', color: '#666' }}>No hay productos disponibles en este momento.</div>;
          }
          
          if (!list || list.length === 0) {
            return <div>No hay productos disponibles</div>;
          }

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8, maxWidth: '100%', overflowX: 'hidden' }}>
              {list.map((p) => {
                const id = p.productoID || p.ProductoID || p.id || p.productId;
                const nombre = p.nombre || p.Nombre || p.NombreProducto || 'Sin nombre';
                const desc = p.descripcion || p.Descripcion || p.DescripcionCorta || '';
                const precio = (p.precio ?? p.Precio) !== undefined ? (p.precio ?? p.Precio) : null;
                
                console.log('Rendering product:', { id, nombre, precio }); // Debug log

                return (
                  <div 
                    key={id || nombre} 
                    style={{ 
                      borderRadius: 8, 
                      padding: 8, 
                      border: '1px solid #ddd', 
                      background: '#fff',
                      margin: '4px 0',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
                      {nombre} {precio ? `- S/${precio}` : ''}
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: '#444', 
                      marginTop: 6,
                      wordBreak: 'break-word',
                      maxHeight: '3em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {desc}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          if (id) window.location.href = `/productos/${id}`;
                        }}
                        style={{ 
                          backgroundColor: '#A8B5A0', 
                          color: '#000', 
                          border: 'none', 
                          borderRadius: 6, 
                          padding: '6px 10px', 
                          cursor: 'pointer',
                          flex: '1 1 auto',
                          minWidth: 'fit-content'
                        }}
                      >
                        Ver detalle
                      </button>
                      <button
                        onClick={() => {
                          const text = `Hola! Estoy interesado en comprar: ${nombre} ${precio ? `(S/${precio})` : ''}. Puedes coordinar conmigo?`;
                          const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
                          window.open(url, '_blank');
                        }}
                        style={{ 
                          backgroundColor: '#D4A574', 
                          color: '#000', 
                          border: 'none', 
                          borderRadius: 6, 
                          padding: '6px 10px', 
                          cursor: 'pointer',
                          flex: '1 1 auto',
                          minWidth: 'fit-content'
                        }}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                );
              })}
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
              style={{
                backgroundColor: '#A8B5A0',
                color: '#000',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#8FA68E')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#A8B5A0')}
            >
              {reply.label}
            </button>
          ))}
        </div>
      ),
    },
  }), [mascotas]);

  const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    // (getMascotaId and whatsappNumber are declared in the outer scope and reused here)
    const quickReplies = [
      { label: 'Recomendaciones', value: 'recomendaciones' },
      { label: 'Productos', value: 'productos' }
    ];

    // helper to send the main options widget (used after each response)
    const sendOptions = () => {
      const optionsMsg = createChatBotMessage('¿En qué más puedo ayudarte?', {
        widget: 'mainOptions',
        widgetProps: {
          handleRecommendations: () => handleRecommendations(),
          handleProductos: () => handleProductos(),
          handleSobre: () => handleSobre(),
        },
      });
      setState((prev) => ({ ...prev, messages: [...prev.messages, optionsMsg] }));
    };

    // handle selection when multiple mascotas exist
    const handleSelectMascota = (mascotaId) => {
      console.log('[Chatbot] handleSelectMascota called with:', mascotaId);
      handleRecommendationsForMascota(mascotaId);
    };

    // produce recommendations for a specific mascota with explanations
const handleRecommendationsForMascota = async (mascotaId) => {
  const mascota = mascotas.find(m => String(getMascotaId(m)) === String(mascotaId));
  if (!mascota) {
    const message = createChatBotMessage('No pude encontrar la mascota seleccionada. Intenta de nuevo.');
    setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
    return;
  }

  try {
    const productos = await productService.getProductos();
    if (!productos || productos.length === 0) {
      const message = createChatBotMessage('Lo siento, no hay productos disponibles para recomendar en este momento.');
      setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
      return;
    }

    const nombre = mascota.nombre || 'tu mascota';
    const notas = mascota.notasAdicionales?.toLowerCase() || '';

    // ------------------------------
    // 🔍 Extraer secciones limpias
    // ------------------------------
    const getSection = (label) => {
      const regex = new RegExp(`${label}:([^|]+)`, 'i');
      const match = notas.match(regex);
      return match ? match[1].split(',').map(s => s.trim().toLowerCase()) : [];
    };

    const alergias = getSection('Alergias');
    const objetivos = getSection('Objetivo nutricional');
    const objetivoPrincipal = (objetivos[0] || 'mantenimiento general').trim().toLowerCase();

    // ------------------------------
    // 🧩 Relaciones: Objetivo → Productos
    // ------------------------------
    const relaciones = {
      'control de peso': ['Galletas Fibra Vital'],
      'aumento de energía o masa muscular': ['Bites NutriCamote & Grillo'],
      'digestión sensible': ['Bocaditos Digest Fit'],
      'piel y pelaje saludables': ['Galletas Piel & Pelaje', 'Crunch Dermosalud'],
      'soporte articular o movilidad': ['Bocaditos Digest Fit', 'Galletas Fibra Vital'],
      'reducción de alergias o intolerancias': ['Galletas Piel & Pelaje', 'Crunch Dermosalud'],
      'soporte inmunológico': ['Bocaditos Digest Fit', 'Galletas Fibra Vital'],
      'vitalidad y longevidad': ['Bites NutriCamote & Grillo'],
      'mantenimiento general': ['Galletas Fibra Vital']
    };

    // ------------------------------
    // 🚫 Diccionario de alergias
    // ------------------------------
    const alergiasMap = {
      insectos: ['grillo', 'insecto'],
      avena: ['avena', 'cereal', 'gluten'],
      coco: ['coco'],
      plátano: ['plátano', 'banana'],
      aceite: ['aceite de oliva', 'oliva'],
      tubérculo: ['camote', 'papa', 'yacón'],
      linaza: ['linaza'],
      calabaza: ['calabaza']
    };

    // Detectar alergias mencionadas
    const detectedAllergies = Object.entries(alergiasMap)
      .filter(([key, terms]) => alergias.some(a => terms.some(t => a.includes(t))))
      .map(([key]) => key);

    // ------------------------------
    // ⚠️ Filtro de productos seguros
    // ------------------------------
    const seguros = productos.filter(p => {
      const texto = `${p.descripcion || ''} ${p.nombre || ''}`.toLowerCase();
      return !detectedAllergies.some(allergy =>
        texto.includes(allergy) ||
        alergiasMap[allergy]?.some(t => texto.includes(t))
      );
    });

    if (detectedAllergies.length > 0 && seguros.length === 0) {
      const warning = createChatBotMessage(
        `He detectado que ${nombre} tiene alergias a (${detectedAllergies.join(', ')}). 
         Sin embargo, no hay productos seguros disponibles actualmente. 
         Te recomiendo consultar con un veterinario para una dieta especializada.`
      );
      setState(prev => ({ ...prev, messages: [...prev.messages, warning] }));
      return;
    }

    // ------------------------------
    // 🎯 Selección basada SOLO en objetivo nutricional
    // ------------------------------
    const key = Object.keys(relaciones).find(k => objetivoPrincipal.includes(k)) || 'mantenimiento general';
    const posibles = relaciones[key] || ['Galletas Fibra Vital'];

    // Buscar coincidencias flexibles entre productos seguros
    const candidatos = seguros.filter(p =>
      posibles.some(pos =>
        (p.nombre || '').toLowerCase().includes(pos.toLowerCase()) ||
        (p.descripcion || '').toLowerCase().includes(pos.toLowerCase())
      )
    );

    const recomendado = candidatos[0] || seguros[0] || productos[0];

    // ------------------------------
    // 💬 Generar mensaje personalizado
    // ------------------------------
    const reason = (() => {
      if (key.includes('piel')) {
        return `Este snack está formulado para mejorar la piel y el brillo del pelaje de ${nombre}, gracias a ingredientes como aceite de oliva, linaza y antioxidantes naturales.`;
      }
      if (key.includes('digestión')) {
        return `Este snack con plátano y avena favorece la digestión y el equilibrio intestinal de ${nombre}, ideal para estómagos sensibles.`;
      }
      if (key.includes('energía') || key.includes('masa')) {
        return `${nombre} necesita energía sostenida y proteínas funcionales. Este snack con grillo y camote ayuda al desarrollo muscular y la recuperación.`;
      }
      if (key.includes('peso')) {
        return `Este snack ayuda a mantener un peso saludable en ${nombre}, con alta fibra, baja grasa y un perfil natural.`;
      }
      if (key.includes('inmunológico')) {
        return `Este snack refuerza el sistema inmune de ${nombre} gracias a sus antioxidantes naturales y minerales esenciales.`;
      }
      if (key.includes('articular') || key.includes('movilidad')) {
        return `Este snack ayuda a mantener la movilidad y el confort articular de ${nombre}, gracias a sus nutrientes funcionales.`;
      }
      if (key.includes('alergias')) {
        return `Este snack tiene un perfil limpio y natural, ideal para ${nombre} si busca reducir alergias o intolerancias leves.`;
      }
      if (key.includes('vitalidad')) {
        return `Este snack aporta vitalidad y longevidad a ${nombre}, con proteínas de alta digestibilidad y antioxidantes.`;
      }
      return `Este snack natural es ideal para el mantenimiento general y bienestar diario de ${nombre}.`;
    })();

    const allergyNote = detectedAllergies.length > 0
      ? `⚠️ Se evitó recomendar productos con: ${detectedAllergies.join(', ')}.`
      : '';

    // ------------------------------
    // 💬 Mensajes del chatbot
    // ------------------------------
    const intro = createChatBotMessage(`Basado en el objetivo nutricional de ${nombre}, tengo una recomendación personalizada:`);
    const explanation = createChatBotMessage(`${reason}\n${allergyNote}`);
    const productCard = createChatBotMessage('Aquí tienes el producto recomendado:', {
      widget: 'productCards',
      payload: [recomendado],
    });

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, intro, explanation, productCard],
    }));
    // 🕐 Después de mostrar la recomendación, volver a ofrecer opciones
    setTimeout(() => {
      const optionsMsg = createChatBotMessage('¿En qué más puedo ayudarte?', {
        widget: 'mainOptions',
        widgetProps: {
          handleRecommendations: () => handleRecommendations(),
          handleProductos: () => handleProductos(),
          handleSobre: () => handleSobre(),
        },
      });
      setState(prev => ({ ...prev, messages: [...prev.messages, optionsMsg] }));
    }, 1500); // espera 1.5 segundos antes de mostrar las opciones

  } catch (error) {
    console.error('Error al generar la recomendación:', error);
    const message = createChatBotMessage('Ocurrió un error al generar la recomendación. Inténtalo de nuevo.');
    setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
  }
};

    // Add an initial greeting message with quick replies when the provider mounts
    useEffect(() => {
      const greetingText = user
        ? `¡Hola ${user.name}! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?`
        : '¡Hola! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?';

      // create greeting message that uses our mainOptions widget so buttons render reliably
      const greeting = createChatBotMessage(greetingText, {
        widget: 'mainOptions',
        widgetProps: {
          handleRecommendations: () => handleRecommendations(),
          handleProductos: () => handleProductos(),
        },
      });

      setState((prev) => {
        // Avoid adding duplicate greetings (React.StrictMode may mount twice in dev)
        const already = prev.messages && prev.messages.some(m => {
          const text = m && (m.message || m.text || '');
          return typeof text === 'string' && text.includes('¿En qué puedo ayudarte hoy?');
        });
        if (already) return prev;
        return {
          ...prev,
          messages: [...prev.messages, greeting],
        };
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Listen for custom events dispatched from the widget buttons as a robust fallback
    useEffect(() => {
      const handler = (e) => {
        const val = e?.detail;
        if (!val) return;
        const m = val.toString().toLowerCase();
        if (m === 'recomendaciones') return handleRecommendations();
        if (m === 'productos') return handleProductos();
        if (m === 'sobre') return handleSobre();
        // handle mascota selection tokens dispatched from widgets: 'seleccionar_mascota_{id}'
        if (m.startsWith('seleccionar_mascota_')) {
          const id = m.replace('seleccionar_mascota_', '');
          console.log('[Chatbot] evento custom seleccionar_mascota recibido:', id);
          return handleSelectMascota(id);
        }
      };
      window.addEventListener('chatbot-option', handler);
      return () => window.removeEventListener('chatbot-option', handler);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mascotas]);

    const handleHello = () => {
      const message = createChatBotMessage('¡Hola! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?', { widget: 'mainOptions' });
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    };

    const handleRecommendations = () => {
      if (!mascotas || mascotas.length === 0) {
        const message = createChatBotMessage(
          'No tienes mascotas registradas. ¡Registra a tu mascota en la seccion de Mascotas para recibir recomendaciones personalizadas!',
          { quickReplies }
        );
        setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
        sendOptions();
        return;
      }

      if (mascotas.length > 1) {
        // Ask which mascota to use using the mascotaOptions widget (buttons)
        const ask = createChatBotMessage('Tienes varias mascotas registradas. ¿Para cual deseas la recomendacion?', {
          widget: 'mascotaOptions',
          widgetProps: { mascotas, handleSelectMascota },
        });
        setState((prev) => ({ ...prev, messages: [...prev.messages, ask] }));
        return;
      }

      // only one mascota -> recommend for that mascota
      const only = mascotas[0];
      handleRecommendationsForMascota(only.mascotaID || only.id || only.idMascota);
    };

    const handleProductos = () => {
      productService.getProductos()
        .then(fetchedProducts => {
        console.log('Products fetched:', fetchedProducts); // Debug log

        if (!fetchedProducts || fetchedProducts.length === 0) {
          const message = createChatBotMessage('No hay productos disponibles en este momento.', { quickReplies });
          setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
          sendOptions();
          return;
        }

        // Update global products state
        setProducts(fetchedProducts);

        // Log products for debugging
        console.log('Fetched products:', fetchedProducts); // Debug log

        // Create the message with the widget and pass products directly
        const productWidgetMsg = createChatBotMessage(
          'Aquí tienes algunos de nuestros productos:',
          {
            widget: 'productCards',
            payload: fetchedProducts.slice(0, 10)
          }
        );

        console.log('Created message with products:', productWidgetMsg); // Debug log

        // Update state with the new message
        setState((prev) => {
          console.log('Updating state with products message'); // Debug log
          return {
            ...prev,
            messages: [...prev.messages, productWidgetMsg]
          };
        });

        // Wait a moment before showing options to ensure products are displayed
          setTimeout(() => {
            sendOptions();
          }, 1000);
        })
        .catch(error => {
          console.error('Error getting products:', error);
          console.error('Detailed error:', error.response?.data || error.message);
          const message = createChatBotMessage('Lo siento, hubo un error al obtener la lista de productos. Intentalo de nuevo.', { quickReplies });
          setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
          sendOptions();
        });
    };

    const handleSobre = () => {
      const message = createChatBotMessage(
        'Patitas y Sabores es una tienda dedicada a ofrecer los mejores productos para tus mascotas. Nos especializamos en snacks premium, juguetes y accesorios de alta calidad, elaborados con ingredientes naturales y pensando en el bienestar de tus compañeros peludos. ¡Estamos aquí para hacer feliz a tu mascota!',
        { quickReplies }
      );
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
      sendOptions();
    };

    return (
      <div>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            key: index,
            actions: {
              handleHello,
              handleRecommendations,
              handleProductos,
              handleSobre,
              handleSelectMascota,
            },
          });
        })}
      </div>
    );
  };

  const MessageParser = ({ children, actions }) => {
    // Only accept the pre-defined quick-reply values. Ignore free text.
    const parse = (message) => {
      if (!message) return;
      const m = message.toString().toLowerCase();
      if (m === 'recomendaciones' || m === 'recomendacion') {
        actions.handleRecommendations();
      } else if (m === 'productos') {
        actions.handleProductos();
      } else if (m.startsWith('seleccionar_mascota_')) {
        const id = m.replace('seleccionar_mascota_', '');
        if (actions.handleSelectMascota) actions.handleSelectMascota(id);
      } else {
        // Do nothing for any other input to ensure users can't use free-text to interact
        // This keeps the chatbot strictly option-driven.
        return;
      }
    };

    return (
      <div>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            key: index,
            parse: parse,
            actions: actions, // preserve the actions object provided by the library
          });
        })}
      </div>
    );
  };

  // Fallback: inject CSS to hide any input/textarea inside the chatbot container
  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-chatbot-hide-input', 'true');
    style.innerHTML = `
      .custom-chatbot-container input, .custom-chatbot-container textarea, .custom-chatbot-container .react-chatbot-kit-chat-input { display: none !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!showChatbot) {
    return (
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setShowChatbot(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#A8B5A0',
          '&:hover': { backgroundColor: '#8FA68E' },
        }}
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
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            backgroundColor: '#D4A574',
            '&:hover': { backgroundColor: '#C49A6A' },
          }}
        >
          <CloseIcon />
        </Fab>
        <Box sx={{ width: 350, height: 500 }}>
          {/* container class used to hide any stray input fields as a fallback */}
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

export default ChatbotComponent;