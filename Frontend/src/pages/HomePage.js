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
import FlagIcon from '@mui/icons-material/Flag';
import PublicIcon from '@mui/icons-material/Public';
import HistoryIcon from '@mui/icons-material/History';
import ProductCarousel from '../components/ProductCarousel';
import FloatingPaws from '../components/FloatingPaws';
import WelcomeModal from '../components/WelcomeModal';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PsychologyIcon from '@mui/icons-material/Psychology';

const values = [
  {
    icon: <EmojiEventsIcon />,
    title: "Calidad y Transparencia",
    description: "Elaboramos cada snack con ingredientes naturales y procesos caseros de alta calidad, siempre con información clara y honesta para generar confianza en cada familia."
  },
  {
    icon: <FavoriteIcon />,
    title: "Bienestar Integral",
    description: "Trabajamos por la salud y felicidad de las mascotas, entendiendo su cuidado como parte esencial del bienestar familiar."
  },
  {
    icon: <PsychologyIcon />,
    title: "Cuidado Personalizado",
    description: "Gracias a la IA, ofrecemos recomendaciones adaptadas a las necesidades únicas de cada peludito, creando vínculos cercanos y experiencias realmente pensadas para ellos."
  }
];

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

  const aboutSections = [
    {
      icon: <FlagIcon sx={{ fontSize: 40 }} />,
      title: 'Misión',
      content: 'Crear snacks naturales que cuiden la salud y felicidad de cada mascota, combinando ingredientes reales con tecnología de IA que nos permite recomendar la opción perfecta para cada peludito. Trabajamos con cariño, responsabilidad y sostenibilidad para acompañar a las familias en el bienestar de sus mejores amigos.',
      color: '#D4A574'
    },
    {
      icon: <PublicIcon sx={{ fontSize: 40 }} />,
      title: 'Visión',
      content: 'Ser la marca peruana líder en snacks naturales personalizados para mascotas, reconocida por nuestra innovación, calidad y compromiso con una alimentación más saludable. Queremos inspirar a miles de familias a nutrir mejor a sus peluditos con ayuda de la inteligencia artificial.',
      color: '#A8B5A0'
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      title: 'Nuestra Historia',
      content: 'Fundada en 2020 por amantes de los animales, Patitas y Sabores nació de la pasión por cuidar a nuestras mascotas de manera natural y saludable. Comenzamos como un pequeño emprendimiento y hoy llegamos a miles de hogares.',
      color: '#8A7B5D'
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

      {/* HERO SECTION - Con bordes redondeados en las 4 esquinas */}
      <Box
        sx={{
          position: 'relative',
          height: isMobile ? '70vh' : '75vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          mx: { xs: 2, md: 3 },
          mt: 2,
          mb: 4
        }}
      >
        {/* Imágenes de fondo con bordes redondeados */}
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
              borderRadius: '20px',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: 1,
                borderRadius: '20px'
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

      {/* FEATURES SECTION */}
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
                    borderRadius: '20px',
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
                  <CardContent sx={{ p: 4, borderRadius: '20px' }}>
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

      {/* INSPIRATION SECTION - Con bordes redondeados en contenedor */}
      <Box 
        sx={{ 
          py: 6, 
          backgroundColor: '#FAF9F6',
          borderRadius: '20px',
          mx: { xs: 2, md: 3 },
          mb: 4
        }}
      >
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
                        objectPosition: 'center',
                        width: '100%',
                        height: '200px',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.03)'
                        }
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

      {/* VALORES SECTION */}
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
          Nuestros Valores
        </Typography>

        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: 'stretch',
            justifyContent: 'center'
          }}
        >
          {values.map((value, index) => (
            <Fade in={showContent} timeout={600 + index * 200} key={index}>
              <Card
                sx={{
                  flex: 1,
                  minWidth: { xs: '100%', md: '300px' },
                  maxWidth: { xs: '100%', md: '400px' },
                  textAlign: 'center',
                  borderRadius: '20px',
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
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1), rgba(168, 181, 160, 0.1))',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center'
                    }}
                  >
                    {React.cloneElement(value.icon, {
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
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#7D6B5D',
                      lineHeight: 1.5,
                      flexGrow: 1
                    }}
                  >
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      </Container>

      {/* ABOUT SECTION - Modificada para disposición horizontal */}
      <Box 
        sx={{ 
          py: 6, 
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          mx: { xs: 2, md: 3 },
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            textAlign="center"
            sx={{
              mb: 6,
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
            Sobre Nosotros
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: 'stretch',
              justifyContent: 'center'
            }}
          >
            {aboutSections.map((section, index) => (
              <Fade in={showContent} timeout={600 + index * 200} key={index}>
                <Card
                  sx={{
                    flex: 1,
                    minWidth: { xs: '100%', md: '300px' },
                    maxWidth: { xs: '100%', md: '400px' },
                    textAlign: 'center',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F6F0 100%)',
                    boxShadow: '0 8px 25px rgba(93, 78, 55, 0.08)',
                    border: '1px solid rgba(212, 165, 116, 0.15)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: `linear-gradient(90deg, ${section.color}, ${section.color}99)`,
                      borderRadius: '16px 16px 0 0'
                    },
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 35px rgba(93, 78, 55, 0.12)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${section.color}20, ${section.color}10)`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center'
                      }}
                    >
                      {React.cloneElement(section.icon, {
                        sx: {
                          fontSize: 40,
                          color: section.color
                        }
                      })}
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: 700,
                        color: '#5D4E37',
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#7D6B5D',
                        lineHeight: 1.6,
                        textAlign: 'left',
                        flexGrow: 1
                      }}
                    >
                      {section.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>

          {/* Imagen adicional */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Box
              sx={{
                height: 300,
                backgroundImage: 'url(https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                mx: 'auto',
                maxWidth: '800px'
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* SOCIAL MEDIA SECTION */}
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
                borderRadius: '16px',
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

      {/* FINAL CTA SECTION - Con bordes redondeados */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          py: 6,
          textAlign: 'center',
          borderRadius: '20px',
          mx: { xs: 2, md: 3 },
          mb: 2
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