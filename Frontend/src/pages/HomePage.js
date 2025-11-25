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
  CardMedia,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Imágenes del hero optimizadas
  const heroImages = [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=600&fit=crop'
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
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Modal de bienvenida al cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeModalOpen(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <PetsIcon sx={{ fontSize: 40 }} />,
      title: 'Productos Premium',
      description: 'Snacks de alta calidad para mascotas'
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Compra Fácil',
      description: 'Proceso simple y seguro desde tu hogar'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: 'Hecho con Amor',
      description: 'Pensando en el bienestar de tu compañero'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      pet: 'Luna (Golden Retriever)',
      rating: 5,
      comment: 'Mis hijos aman estos snacks tanto como Luna. Son 100% naturales y de excelente calidad.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face'
    },
    {
      name: 'Carlos Rodríguez',
      pet: 'Milo (Gato Siamés)',
      rating: 5,
      comment: 'Milo es muy exigente pero estos snacks son su favorito. Calidad excepcional y entrega rápida.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
    },
    {
      name: 'Ana López',
      pet: 'Bella (Bulldog Francés)',
      rating: 5,
      comment: 'Bella tiene problemas digestivos y estos snacks naturales han sido una bendición.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
    }
  ];

  const inspirationItems = [
    {
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
      quote: 'El amor por todas las criaturas vivientes es el más noble atributo del hombre.'
    },
    {
      image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&h=300&fit=crop',
      quote: 'Hasta que no hayas amado a un animal, una parte de tu alma permanecerá dormida.'
    },
    {
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop',
      quote: 'Los animales son amigos tan agradables: no hacen preguntas, no critican.'
    },
    {
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
      quote: 'La grandeza de una nación se puede juzgar por la forma en que trata a sus animales.'
    }
  ];

  const socialMedia = [
    { icon: <FacebookIcon />, name: 'Facebook', url: 'https://facebook.com/patitasySabores' },
    { icon: <WhatsAppIcon />, name: 'WhatsApp', url: 'https://wa.me/1234567890' },
    { icon: <InstagramIcon />, name: 'Instagram', url: 'https://instagram.com/patitasySabores' },
    { icon: <TikTokIcon />, name: 'TikTok', url: 'https://tiktok.com/@patitasySabores' }
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      <FloatingPaws />

      {/* HERO SECTION - Más compacto */}
      <Box
        sx={{
          position: 'relative',
          height: isMobile ? '70vh' : '75vh',
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
              transition: 'opacity 1.2s ease-in-out',
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

        {/* Contenido principal */}
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in={showContent} timeout={800}>
            <Box textAlign="center" sx={{ px: 2 }}>
              <Slide direction="down" in={showContent} timeout={600}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    color: '#FFFFFF',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                    lineHeight: 1.1
                  }}
                >
                  Patitas y Sabores
                </Typography>
              </Slide>

              <Slide direction="up" in={showContent} timeout={800}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: '#F8F6F0',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                    fontWeight: 400,
                    lineHeight: 1.4
                  }}
                >
                  Los mejores productos para los miembros más peludos de tu familia
                </Typography>
              </Slide>

              <Zoom in={showContent} timeout={1000}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/productos"
                  sx={{
                    px: 6,
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '25px',
                    background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 25px rgba(212, 165, 116, 0.4)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 30px rgba(212, 165, 116, 0.6)',
                    }
                  }}
                >
                  Explorar Productos
                </Button>
              </Zoom>
            </Box>
          </Fade>
        </Container>

        {/* Indicadores */}
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
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: currentImageIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { backgroundColor: 'white' }
              }}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </Box>
      </Box>

      {/* FEATURES SECTION - Más compacto */}
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: '#5D4E37',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 3,
              background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
              borderRadius: '2px'
            }
          }}
        >
          ¿Por qué elegirnos?
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Fade in={showContent} timeout={600 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                    boxShadow: '0 8px 25px rgba(93, 78, 55, 0.08)',
                    border: '1px solid rgba(212, 165, 116, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(93, 78, 55, 0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1), rgba(168, 181, 160, 0.1))',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: {
                          fontSize: 40,
                          color: '#D4A574'
                        }
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#5D4E37',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#7D6B5D',
                        lineHeight: 1.5,
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

      {/* INSPIRATION SECTION - Diseño compacto y profesional */}
<Box sx={{ py: 6, backgroundColor: '#FAF9F6' }}>
  <Container maxWidth="lg">
    <Typography
      variant="h4"
      textAlign="center"
      sx={{
        mb: 4,
        fontWeight: 700,
        color: '#5D4E37',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 3,
          background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
          borderRadius: '2px'
        }
      }}
    >
      Nuestra Inspiración
    </Typography>
    
    <Grid container spacing={3} justifyContent="center">
      {inspirationItems.map((item, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Zoom in={showContent} timeout={800 + index * 200}>
            <Card
              sx={{
                borderRadius: '16px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={`Inspiración ${index + 1}`}
                sx={{ 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    color: '#5D4E37',
                    lineHeight: 1.5,
                    textAlign: 'center',
                    fontWeight: 500
                  }}
                >
                  "{item.quote}"
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>

      {/* TESTIMONIALS SECTION - Integrado */}
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: '#5D4E37',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 3,
              background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
              borderRadius: '2px'
            }
          }}
        >
          Opiniones de Clientes
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in={showContent} timeout={800 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    boxShadow: '0 6px 20px rgba(93, 78, 55, 0.08)',
                    border: '1px solid rgba(212, 165, 116, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 10px 25px rgba(93, 78, 55, 0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          sx={{ color: '#FFD700', fontSize: 18 }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: '#5D4E37',
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                      }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: '50%',
                          backgroundImage: `url(${testimonial.avatar})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          mr: 2
                        }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: '#5D4E37',
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#7D6B5D',
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

      {/* ABOUT SECTION - Más conciso */}
      <Box sx={{ py: 6, backgroundColor: '#FAF9F6' }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: 700,
                  color: '#5D4E37',
                }}
              >
                Sobre Nosotros
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  color: '#7D6B5D',
                  lineHeight: 1.6,
                }}
              >
                En Patitas y Sabores nos dedicamos a proporcionar snacks premium de alta 
                calidad para mascotas, elaborados con ingredientes naturales y nutritivos. 
                Creemos que cada mascota merece lo mejor.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#7D6B5D',
                  lineHeight: 1.6,
                }}
              >
                Fundada por amantes de los animales, nuestra misión es promover la salud 
                y el bienestar de tus compañeros peludos con productos de la más alta calidad.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 300,
                  backgroundImage: 'url(https://images.unsplash.com/photo-1551717743-49959800b1f6?w=600&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '16px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SOCIAL MEDIA SECTION - Integrado */}
      <Container sx={{ py: 6 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            mb: 3,
            fontWeight: 700,
            color: '#5D4E37',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 3,
              background: 'linear-gradient(90deg, #D4A574, #A8B5A0)',
              borderRadius: '2px'
            }
          }}
        >
          Síguenos
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          sx={{
            mb: 4,
            color: '#7D6B5D',
            maxWidth: '500px',
            mx: 'auto',
          }}
        >
          Conecta con nosotros para novedades, consejos y ofertas exclusivas.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          {socialMedia.map((social, index) => (
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
                p: 2,
                borderRadius: '12px',
                background: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(93, 78, 55, 0.08)',
                border: '1px solid rgba(212, 165, 116, 0.15)',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                minWidth: 80,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 20px rgba(93, 78, 55, 0.12)',
                }
              }}
            >
              <Box sx={{ mb: 1, color: '#D4A574' }}>
                {React.cloneElement(social.icon, { sx: { fontSize: 32 } })}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: '#5D4E37',
                }}
              >
                {social.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* FINAL CTA SECTION - Más compacto */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            ¡Encuentra el Snack Perfecto!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: '#ECF0F1',
              lineHeight: 1.5,
            }}
          >
            Descubre nuestra variedad de snacks premium naturales para perros y gatos. 
            Calidad garantizada para tu compañero peludo.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/productos"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #D4A574 0%, #A8B5A0 100%)',
              color: '#FFFFFF',
              boxShadow: '0 8px 25px rgba(212, 165, 116, 0.4)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(212, 165, 116, 0.6)',
              }
            }}
          >
            Ver Catálogo
          </Button>
        </Container>
      </Box>

      {/* Welcome Modal */}
      <WelcomeModal
        open={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
      />
    </Box>
  );
};

export default HomePage;