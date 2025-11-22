import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Fade,
  Slide,
  Zoom,
  CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicNote';
import ProductCarousel from '../components/ProductCarousel';
import FloatingPaws from '../components/FloatingPaws';
import WelcomeModal from '../components/WelcomeModal';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  // Imágenes del hero
  const heroImages = [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=800&fit=crop'
  ];

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Mostrar contenido con animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Modal de bienvenida al cargar
  useEffect(() => {
    setWelcomeModalOpen(true);
  }, []);

  const features = [
    {
      icon: <PetsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Productos Premium',
      description: 'Snacks de alta calidad especialmente formulados para mascotas'
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Compra Fácil',
      description: 'Proceso de compra simple y seguro desde la comodidad de tu hogar'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 48, color: 'error.main' }} />,
      title: 'Amor por las Mascotas',
      description: 'Cada producto está hecho pensando en el bienestar de tu compañero'
    }
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      <FloatingPaws />

      {/* HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          height: '80vh', // antes 90vh -> más compacto
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Imágenes de fondo */}
        {heroImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentImageIndex === index ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 1
              }
            }}
          />
        ))}

        {/* Card flotante con carrusel de productos */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            width: { xs: '200px', sm: '300px', md: '450px' },
            height: { xs: '200px', sm: '300px', md: '450px' },
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 3
          }}
        >
          <ProductCarousel />
        </Box>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}</style>

        {/* Texto principal hero */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in={showContent} timeout={1000}>
            <Box textAlign="center">
              <Slide direction="down" in={showContent} timeout={800}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 700,
                    mb: 2,
                    color: '#FFFFFF',
                    textShadow:
                      '3px 3px 6px rgba(0,0,0,0.7), 0 0 20px rgba(248, 246, 240, 0.3)',
                    animation: 'bounce 2s ease-in-out',
                    WebkitTextStroke: '1px rgba(212, 165, 116, 0.3)'
                  }}
                >
                  Patitas y Sabores
                </Typography>
              </Slide>

              <Slide direction="up" in={showContent} timeout={1000}>
                <Typography
                  variant="h4"
                  sx={{
                    mb: 3, // antes 4 -> más compacto
                    color: '#F8F6F0',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                    fontWeight: 400,
                    lineHeight: 1.4
                  }}
                >
                  Los mejores productos para los miembros más peludos de tu familia
                </Typography>
              </Slide>

              <Zoom in={showContent} timeout={1200}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/productos"
                  sx={{
                    px: 8,
                    py: 2.5,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    borderRadius: '50px',
                    background:
                      'linear-gradient(135deg, #D4A574 0%, #A8B5A0 50%, #8A7B5D 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 30px rgba(212, 165, 116, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    transition:
                      'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    textTransform: 'none',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 20px 40px rgba(212, 165, 116, 0.5)',
                      background:
                        'linear-gradient(135deg, #B8955D 0%, #8A9683 50%, #6B5D4A 100%)',
                      border: '2px solid rgba(255, 255, 255, 0.4)'
                    },
                    '&:active': {
                      transform: 'translateY(-2px) scale(1.02)'
                    }
                  }}
                >
                  Explorar Productos
                </Button>
              </Zoom>
            </Box>
          </Fade>
        </Container>

        {/* Indicadores del carrusel de fondo */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 2
          }}
        >
          {heroImages.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor:
                  currentImageIndex === index
                    ? 'white'
                    : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white'
                }
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </Box>
      </Box>

      {/* FEATURES SECTION */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FAF9F6' }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          sx={{
            mb: 4, // antes 8
            fontWeight: 700,
            color: '#5D4E37',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 4,
              background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
              borderRadius: '2px'
            }
          }}
        >
          ¿Por qué elegir Patitas y Sabores?
        </Typography>

        <Grid container spacing={6} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in={showContent} timeout={800 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: '24px',
                    background:
                      'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                    boxShadow: '0 12px 40px rgba(93, 78, 55, 0.1)',
                    border: '1px solid rgba(212, 165, 116, 0.2)',
                    transition:
                      'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background:
                        index === 0
                          ? 'linear-gradient(90deg, #D4A574, #A8B5A0)'
                          : index === 1
                          ? 'linear-gradient(90deg, #A8B5A0, #8A7B5D)'
                          : 'linear-gradient(90deg, #8A7B5D, #D4A574)',
                      borderRadius: '24px 24px 0 0'
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 60px rgba(93, 78, 55, 0.15)',
                      border: '1px solid rgba(212, 165, 116, 0.4)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Box
                      sx={{
                        mb: 4,
                        p: 3,
                        borderRadius: '50%',
                        background:
                          index === 0
                            ? 'linear-gradient(135deg, rgba(212, 165, 116, 0.1), rgba(168, 181, 160, 0.1))'
                            : index === 1
                            ? 'linear-gradient(135deg, rgba(168, 181, 160, 0.1), rgba(138, 123, 93, 0.1))'
                            : 'linear-gradient(135deg, rgba(138, 123, 93, 0.1), rgba(212, 165, 116, 0.1))',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: {
                          fontSize: 56,
                          color:
                            index === 0
                              ? '#D4A574'
                              : index === 1
                              ? '#A8B5A0'
                              : '#8A7B5D'
                        }
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: 700,
                        color: '#5D4E37',
                        fontSize: '1.4rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#7D6B5D',
                        lineHeight: 1.6,
                        fontSize: '1rem',
                        fontWeight: 400
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* INSPIRATION SECTION */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: '#5D4E37',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
                borderRadius: '2px'
              }
            }}
          >
            Nuestra Inspiración
          </Typography>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            {[
              {
                image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80',
                quote:
                  'El amor por todas las criaturas vivientes es el más noble atributo del hombre.'
              },
              {
                image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800&q=80',
                quote:
                  'Hasta que no hayas amado a un animal, una parte de tu alma permanecerá dormida.'
              },
              {
                image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80',
                quote:
                  'Los animales son amigos tan agradables: no hacen preguntas, no critican.'
              },
              {
                image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',
                quote:
                  'La grandeza de una nación se puede juzgar por la forma en que trata a sus animales.'
              },
              {
                image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&q=80',
                quote:
                  'El tiempo pasado con los gatos nunca es tiempo perdido.'
              },
              {
                image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&q=80',
                quote:
                  'Un perro es la única cosa en la tierra que te ama más de lo que se ama a sí mismo.'
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Zoom in={showContent} timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      borderRadius: '20px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover .quote-overlay': {
                        opacity: 1,
                        transform: 'translateY(0)'
                      },
                      '&:hover .image-zoom': {
                        transform: 'scale(1.15)'
                      }
                    }}
                  >
                    <CardMedia
                      className="image-zoom"
                      component="img"
                      height="400"
                      image={item.image}
                      alt={`Inspiration ${index + 1}`}
                      sx={{ transition: 'transform 0.5s ease' }}
                    />
                    <Box
                      className="quote-overlay"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#FFFFFF',
                        p: 3,
                        textAlign: 'center',
                        opacity: 0,
                        transform: 'translateY(100%)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease'
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontStyle: 'italic',
                          fontWeight: 300,
                          color: '#FFFFFF'
                        }}
                      >
                        "{item.quote}"
                      </Typography>
                    </Box>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>



      {/* TESTIMONIALS SECTION */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mb: 4, // antes 6
              fontWeight: 700,
              color: '#5D4E37',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Lo Que Dicen Nuestros Clientes
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {[
              {
                name: 'María González',
                pet: 'Luna (Golden Retriever)',
                rating: 5,
                comment:
                  'Mis hijos aman estos snacks tanto como Luna. Son 100% naturales y Luna los devora con gusto. ¡Servicio excelente!',
                avatar:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
              },
              {
                name: 'Carlos Rodríguez',
                pet: 'Milo (Gato Siamés)',
                rating: 5,
                comment:
                  'Milo es muy exigente con la comida, pero estos snacks premium son su favorito. Calidad excepcional y entrega rápida.',
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
              },
              {
                name: 'Ana López',
                pet: 'Bella (Bulldog Francés)',
                rating: 5,
                comment:
                  'Bella tiene problemas digestivos y estos snacks naturales han sido una bendición. Mi veterinario los recomienda.',
                avatar:
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
              }
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in={showContent} timeout={1200 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '20px',
                      background:
                        'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                      boxShadow: '0 8px 32px rgba(93, 78, 55, 0.1)',
                      border: '1px solid rgba(212, 165, 116, 0.2)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow:
                          '0 15px 45px rgba(93, 78, 55, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', mb: 3 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon
                            key={i}
                            sx={{ color: '#FFD700', fontSize: 20 }}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          color: '#5D4E37',
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          fontSize: '1rem'
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            backgroundImage: `url(${testimonial.avatar})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            mr: 2
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#5D4E37',
                              fontSize: '1rem'
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#7D6B5D',
                              fontSize: '0.9rem'
                            }}
                          >
                            Dueño de {testimonial.pet}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* NOSOTROS SECTION */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FAF9F6' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: '#5D4E37',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
                borderRadius: '2px'
              }
            }}
          >
            Sobre Nosotros
          </Typography>
          <Grid
            container
            spacing={6}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: '#5D4E37',
                  lineHeight: 1.6
                }}
              >
                Nuestra Misión
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: '#7D6B5D',
                  lineHeight: 1.8,
                  fontSize: '1.1rem'
                }}
              >
                En Patitas y Sabores, nos dedicamos a proporcionar snacks
                premium de alta calidad para mascotas, elaborados con
                ingredientes naturales y nutritivos. Creemos que cada mascota
                merece lo mejor, y trabajamos incansablemente para ofrecer
                productos que promuevan la salud y el bienestar de tus
                compañeros peludos.
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  color: '#5D4E37',
                  lineHeight: 1.6
                }}
              >
                Nuestra Historia
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#7D6B5D',
                  lineHeight: 1.8,
                  fontSize: '1.1rem'
                }}
              >
                Fundada por amantes de los animales, Patitas y Sabores nació de
                la pasión por cuidar a nuestras mascotas de manera natural y
                saludable. Desde nuestros inicios, hemos crecido gracias a la
                confianza de miles de dueños que buscan lo mejor para sus
                amigos de cuatro patas.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 400,
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1551717743-49959800b1f6?w=600&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>



      {/* SOCIAL MEDIA SECTION */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: '#5D4E37',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
                borderRadius: '2px'
              }
            }}
          >
            Síguenos en Redes Sociales
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              mb: 4, // antes 6
              color: '#7D6B5D',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Conecta con nosotros y mantente al día con las últimas novedades,
            consejos para mascotas y ofertas exclusivas.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap'
            }}
          >
            {[
              {
                icon: (
                  <FacebookIcon sx={{ fontSize: 48, color: '#1877F2' }} />
                ),
                name: 'Facebook',
                url: 'https://facebook.com/patitasySabores'
              },
              {
                icon: (
                  <WhatsAppIcon sx={{ fontSize: 48, color: '#25D366' }} />
                ),
                name: 'WhatsApp',
                url: 'https://wa.me/1234567890'
              },
              {
                icon: (
                  <InstagramIcon sx={{ fontSize: 48, color: '#E4405F' }} />
                ),
                name: 'Instagram',
                url: 'https://instagram.com/patitasySabores'
              },
              {
                icon: (
                  <TikTokIcon sx={{ fontSize: 48, color: '#000000' }} />
                ),
                name: 'TikTok',
                url: 'https://tiktok.com/@patitasySabores'
              }
            ].map((social, index) => (
              <Box
                key={index}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  borderRadius: '20px',
                  background:
                    'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                  boxShadow: '0 8px 32px rgba(93, 78, 55, 0.1)',
                  border: '1px solid rgba(212, 165, 116, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  textDecoration: 'none',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.05)',
                    boxShadow:
                      '0 15px 45px rgba(93, 78, 55, 0.15)',
                    border: '1px solid rgba(212, 165, 116, 0.4)'
                  }
                }}
              >
                <Box sx={{ mb: 2 }}>{social.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#5D4E37',
                    fontSize: '1rem'
                  }}
                >
                  {social.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>



      {/* CTA FINAL SECTION */}
      <Box
        sx={{
          background:
            'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)',
          py: { xs: 6, md: 8 }, // antes 10
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23D4A574" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: '#FFFFFF',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -15,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 100,
                height: 4,
                background:
                  'linear-gradient(90deg, #D4A574, #A8B5A0, #8A7B5D)',
                borderRadius: '2px'
              }
            }}
          >
            ¡Descubre nuestros productos!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              color: '#ECF0F1',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 400,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            Explora nuestra amplia variedad de snacks premium para perros y
            gatos, todos elaborados con ingredientes naturales y de la más alta
            calidad. ¡Encuentra el snack perfecto para tu compañero peludo!
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/productos"
            sx={{
              px: 8,
              py: 3,
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: '50px',
              background:
                'linear-gradient(135deg, #D4A574 0%, #A8B5A0 50%, #8A7B5D 100%)',
              color: '#FFFFFF',
              boxShadow: '0 12px 35px rgba(212, 165, 116, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              transition:
                'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              textTransform: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s'
              },
              '&:hover': {
                transform: 'translateY(-4px) scale(1.05)',
                boxShadow:
                  '0 20px 45px rgba(212, 165, 116, 0.5)',
                background:
                  'linear-gradient(135deg, #B8955D 0%, #8A9683 50%, #6B5D4A 100%)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                '&::before': {
                  left: '100%'
                }
              },
              '&:active': {
                transform: 'translateY(-2px) scale(1.02)'
              }
            }}
          >
            Ver Catálogo Completo
          </Button>
        </Container>
      </Box>

      {/* Animación de bounce del título principal */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>

      {/* Welcome Modal */}
      <WelcomeModal
        open={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
      />
    </Box>
  );
};

export default HomePage;
