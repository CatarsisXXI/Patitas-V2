import React, { useState, useEffect, useMemo } from 'react';
import Chatbot from 'react-chatbot-kit';
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
    // initialMessages will be injected by the ActionProvider using createChatBotMessage
    initialMessages: [],
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
            <button
              onClick={() => {
                if (props.onQuickReply) return props.onQuickReply('sobre');
                if (props.widgetProps && props.widgetProps.handleSobre) return props.widgetProps.handleSobre();
                window.dispatchEvent(new CustomEvent('chatbot-option', { detail: 'sobre' }));
              }}
              style={{ backgroundColor: '#A8B5A0', color: '#000', border: 'none', borderRadius: 20, padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Sobre Patitas y Sabores
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
        widgetFunc: (props) => {
          const list = props.widgetProps?.products || [];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              {list.map((p) => {
                const id = p.productoID || p.ProductoID || p.id || p.productId;
                const nombre = p.nombre || p.Nombre || p.NombreProducto || 'Sin nombre';
                const desc = p.descripcion || p.Descripcion || p.DescripcionCorta || '';
                const precio = (p.precio ?? p.Precio) !== undefined ? (p.precio ?? p.Precio) : null;
                return (
                  <div key={id || nombre} style={{ borderRadius: 8, padding: 8, border: '1px solid #ddd', background: '#fff' }}>
                    <div style={{ fontWeight: 'bold' }}>{nombre} {precio ? `- S/${precio}` : ''}</div>
                    <div style={{ fontSize: 12, color: '#444', marginTop: 6 }}>{desc}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => {
                          if (id) window.location.href = `/productos/${id}`;
                        }}
                        style={{ backgroundColor: '#A8B5A0', color: '#000', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
                      >
                        Ver detalle
                      </button>
                      <button
                        onClick={() => {
                          const text = `Hola! Estoy interesado en comprar: ${nombre} ${precio ? `(S/${precio})` : ''}. Puedes coordinar conmigo?`;
                          const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
                          window.open(url, '_blank');
                        }}
                        style={{ backgroundColor: '#D4A574', color: '#000', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
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
      { label: 'Productos', value: 'productos' },
      { label: 'Sobre Patitas y Sabores', value: 'sobre' }
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
        const msg = createChatBotMessage('No pude encontrar la mascota seleccionada. Intenta de nuevo.', { quickReplies });
        setState((prev) => ({ ...prev, messages: [...prev.messages, msg] }));
        sendOptions();
        return;
      }

      try {
        const products = await productService.getProductos();
        let recommendations = [];

        const especie = mascota.especie?.toLowerCase();
        const edad = mascota.edad;
        const tamano = mascota.tamano?.toLowerCase();
        const raza = mascota.raza?.toLowerCase();
        const notas = mascota.notasAdicionales?.toLowerCase();

        products.forEach(product => {
          const desc = product.descripcion?.toLowerCase() || '';
          const nombre = product.nombre?.toLowerCase() || '';
          const reasons = [];
          let score = 0;

          if (especie === 'perro' && (nombre.includes('perro') || desc.includes('perro'))) { score += 2; reasons.push('Adecuado para perros'); }
          if (especie === 'gato' && (nombre.includes('gato') || desc.includes('gato'))) { score += 2; reasons.push('Adecuado para gatos'); }
          if (edad && desc.includes(edad.toString())) { score += 1; reasons.push(`Apto para edad: ${edad}`); }
          if (tamano && desc.includes(tamano)) { score += 1; reasons.push(`Tamaño compatible: ${tamano}`); }
          if (raza && desc.includes(raza)) { score += 1; reasons.push(`Raza compatible: ${raza}`); }
          if (notas && desc.includes(notas)) { score += 1; reasons.push('Coincide con notas adicionales de la mascota'); }

          if (score > 0) recommendations.push({ product, score, reasons });
        });

        recommendations.sort((a,b) => b.score - a.score);
        const unique = [];
        const seen = new Set();
        recommendations.forEach(r => {
          const id = r.product.productoID;
          if (!seen.has(id)) { unique.push(r); seen.add(id); }
        });

  const top = unique.slice(0,5);
        if (top.length === 0) {
          const fallback = createChatBotMessage('No encontré coincidencias específicas para esta mascota. Te muestro algunos productos populares:', { quickReplies });
          setState((prev) => ({ ...prev, messages: [...prev.messages, fallback] }));
          // show some products then options
          const fallbackProducts = products.slice(0,3).map(p => `• ${p.nombre} — ${p.descripcion || ''}`).join('\n');
          const listMsg = createChatBotMessage(fallbackProducts, { quickReplies });
          setState((prev) => ({ ...prev, messages: [...prev.messages, listMsg] }));
          sendOptions();
          return;
        }

        // Build detailed explanation message
        let messageText = `Recomendaciones para ${mascota.nombre} (${mascota.especie}):\n\n`;
        top.forEach((r, idx) => {
          messageText += `${idx+1}. ${r.product.nombre} — ${r.product.descripcion || ''}\n`;
          messageText += `   Por qué lo recomiendo: ${r.reasons.join('; ')}.\n\n`;
        });

        // send recommendations as product cards widget
        const productWidgetMsg = createChatBotMessage('', {
          widget: 'productCards',
          widgetProps: { products: top.map(r => r.product) }
        });
        const header = createChatBotMessage(messageText, { quickReplies });
        setState((prev) => ({ ...prev, messages: [...prev.messages, header, productWidgetMsg] }));
        sendOptions();
      } catch (error) {
        console.error('Error getting recommendations for mascota:', error);
        const message = createChatBotMessage('Lo siento, hubo un error al generar recomendaciones. Inténtalo de nuevo.', { quickReplies });
        setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
        sendOptions();
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
          handleSobre: () => handleSobre(),
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
      const message = createChatBotMessage('¡Hola! ¿Cómo estás?', { quickReplies });
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    };

    const handleRecommendations = async () => {
      if (!mascotas || mascotas.length === 0) {
        const message = createChatBotMessage(
          'No tienes mascotas registradas. ¡Registra a tu mascota en la sección de Mascotas para recibir recomendaciones personalizadas!',
          { quickReplies }
        );
        setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
        sendOptions();
        return;
      }

      if (mascotas.length > 1) {
        // Ask which mascota to use using the mascotaOptions widget (buttons)
        const ask = createChatBotMessage('Tienes varias mascotas registradas. ¿Para cuál deseas la recomendación?', {
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

    const handleProductos = async () => {
      try {
        const products = await productService.getProductos();

        if (!products || products.length === 0) {
          const message = createChatBotMessage('No hay productos disponibles en este momento.', { quickReplies });
          setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
          sendOptions();
          return;
        }

        // Prepare data for productCards widget
        const header = createChatBotMessage('Aquí tienes algunos de nuestros productos:', { quickReplies });
        const productWidgetMsg = createChatBotMessage('', {
          widget: 'productCards',
          widgetProps: { products: products.slice(0, 10) }
        });
        setState((prev) => ({ ...prev, messages: [...prev.messages, header, productWidgetMsg] }));
        sendOptions();
      } catch (error) {
        console.error('Error getting products:', error);
        const message = createChatBotMessage('Lo siento, hubo un error al obtener la lista de productos. Inténtalo de nuevo.', { quickReplies });
        setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
        sendOptions();
      }
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
      } else if (m === 'sobre' || m === 'sobre patitas y sabores' || m === 'sobre patitas y sabores') {
        actions.handleSobre();
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