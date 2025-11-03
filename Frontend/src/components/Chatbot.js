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
  const [showChatbot, setShowChatbot] = useState(false);
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

  const config = useMemo(() => ({
    initialMessages: [
      {
        type: 'bot',
        message: user
          ? `¡Hola ${user.name}! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?`
          : '¡Hola! Soy Coco, tu asistente de Patitas y Sabores. ¿En qué puedo ayudarte hoy?',
      },
    ],
    botName: 'Coco',
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
    },
  }), [user]);

  const ActionProvider = ({ createChatBotMessage, setState, children }) => {
    const handleHello = () => {
      const message = createChatBotMessage('¡Hola! ¿Cómo estás?');
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    };

    const handleRecommendations = async () => {
      if (mascotas.length === 0) {
        const message = createChatBotMessage(
          'No tienes mascotas registradas. ¡Registra a tu mascota en la sección de Mascotas para recibir recomendaciones personalizadas!'
        );
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
        return;
      }

      try {
        // Get products
        const products = await productService.getProductos();

        // Simple recommendation based on pet species
        const hasDog = mascotas.some(m => m.especie === 'Perro');
        const hasCat = mascotas.some(m => m.especie === 'Gato');

        let recommendations = [];
        if (hasDog) {
          recommendations = products.filter(p => p.nombre.toLowerCase().includes('perro') || p.nombre.toLowerCase().includes('dog'));
        }
        if (hasCat) {
          recommendations = [...recommendations, ...products.filter(p => p.nombre.toLowerCase().includes('gato') || p.nombre.toLowerCase().includes('cat'))];
        }

        if (recommendations.length === 0) {
          recommendations = products.slice(0, 3); // Fallback to first 3 products
        }

        const recMessage = `Basado en tus mascotas (${mascotas.map(m => m.nombre).join(', ')}), te recomiendo: ${recommendations.slice(0, 3).map(p => p.nombre).join(', ')}.`;
        const message = createChatBotMessage(recMessage);
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      } catch (error) {
        console.error('Error getting recommendations:', error);
        const message = createChatBotMessage('Lo siento, hubo un error al obtener recomendaciones. Inténtalo de nuevo.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }
    };

    const handleOpenAI = async (userMessage) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          const message = createChatBotMessage('Debes estar logueado para usar el chatbot avanzado.');
          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, message],
          }));
          return;
        }

        const response = await fetch('http://localhost:5288/api/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        const aiMessage = data.message || 'Lo siento, no pude procesar tu mensaje.';
        const message = createChatBotMessage(aiMessage);
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      } catch (error) {
        console.error('Error with chatbot:', error);
        const message = createChatBotMessage('Lo siento, hubo un error con el chatbot. Inténtalo de nuevo.');
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }
    };

    return (
      <div>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            key: index,
            actions: {
              handleHello,
              handleRecommendations,
              handleOpenAI,
            },
          });
        })}
      </div>
    );
  };

  const MessageParser = ({ children, actions }) => {
    const parse = (message) => {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('hola') || lowerMessage.includes('hello')) {
        actions.handleHello();
      } else if (lowerMessage.includes('recomendacion') || lowerMessage.includes('recomendar')) {
        actions.handleRecommendations();
      } else {
        actions.handleOpenAI(message);
      }
    };

    return (
      <div>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            key: index,
            parse: parse,
            actions: {},
          });
        })}
      </div>
    );
  };

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
          <Chatbot
            key={showChatbot ? 'open' : 'closed'}
            config={config}
            actionProvider={ActionProvider}
            messageParser={MessageParser}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatbotComponent;