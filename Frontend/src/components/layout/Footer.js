import React from 'react';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Logo from '../ui/Logo';
import { PawPrint } from '../ui/PawPrint';
import { color } from '../../theme/tokens';
import { site, whatsappUrl } from '../../config/site';
import { useAuth } from '../../context/AuthContext';

const TikTokIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-4.66 1.56 2.59 2.59 0 0 1 2.9-4.02V9.78a5.68 5.68 0 0 0-6.3 6.1 5.68 5.68 0 0 0 11.36-.48V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.45-1.48z" />
  </svg>
);

const SOCIAL_ICONS = { Instagram: <InstagramIcon fontSize="small" />, Facebook: <FacebookRoundedIcon fontSize="small" />, TikTok: <TikTokIcon /> };

const FooterLink = ({ to, href, children }) => {
  const props = href ? { component: 'a', href, target: '_blank', rel: 'noopener noreferrer' } : { component: Link, to };
  return (
    <Box
      {...props}
      sx={{
        display: 'inline-block',
        py: 0.6,
        color: 'rgba(246, 242, 231, 0.74)',
        fontSize: '0.9375rem',
        transition: 'color 160ms ease',
        '&:hover': { color: color.paper },
      }}
    >
      {children}
    </Box>
  );
};

const Column = ({ title, children }) => (
  <Box component="nav" aria-label={title}>
    <Typography variant="overline" component="h2" sx={{ display: 'block', mb: 1.25, color: color.olive[300] }}>
      {title}
    </Typography>
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {React.Children.map(children, (child) => child && <li>{child}</li>)}
    </Box>
  </Box>
);

const Footer = () => {
  const { user, isCustomer } = useAuth();

  return (
    <Box component="footer" className="no-print" sx={{ mt: { xs: 10, md: 14 }, bgcolor: color.olive[900], color: color.paper, position: 'relative', overflow: 'hidden' }}>
      <Box aria-hidden="true" sx={{ position: 'absolute', right: -40, bottom: -60, color: 'rgba(246, 242, 231, 0.04)', transform: 'rotate(18deg)' }}>
        <PawPrint size={340} />
      </Box>
      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 7, md: 9 } }}>
        <Box sx={{ display: 'grid', gap: { xs: 5, md: 8 }, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.6fr 1fr 1fr 1fr' } }}>
          <Box sx={{ gridColumn: { sm: '1 / -1', md: 'auto' } }}>
            <Logo light size={52} />
            <Typography sx={{ mt: 2.5, maxWidth: 340, color: 'rgba(246, 242, 231, 0.74)' }}>
              Snacks naturales para perros y gatos, preparados de forma casera y recomendados según las necesidades de cada mascota.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              {site.social.map((item) => (
                <IconButton
                  key={item.name}
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} de ${site.name}`}
                  sx={{
                    width: 44,
                    height: 44,
                    color: color.paper,
                    border: '1px solid rgba(246, 242, 231, 0.22)',
                    '&:hover': { bgcolor: color.paper, color: color.olive[900] },
                  }}
                >
                  {SOCIAL_ICONS[item.name]}
                </IconButton>
              ))}
              <IconButton
                component="a"
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp de ${site.name}`}
                sx={{ width: 44, height: 44, color: color.paper, border: '1px solid rgba(246, 242, 231, 0.22)', '&:hover': { bgcolor: color.paper, color: color.olive[900] } }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Column title="Tienda">
            <FooterLink to="/productos">Catálogo</FooterLink>
            <FooterLink to="/#valores">Nuestros valores</FooterLink>
            <FooterLink to="/#nosotros">Sobre nosotros</FooterLink>
          </Column>

          <Column title="Tu cuenta">
            {user ? null : <FooterLink to="/login">Iniciar sesión</FooterLink>}
            {user ? null : <FooterLink to="/registro">Crear cuenta</FooterLink>}
            {isCustomer ? <FooterLink to="/mascotas">Mis mascotas</FooterLink> : null}
            {isCustomer ? <FooterLink to="/favoritos">Favoritos</FooterLink> : null}
            {isCustomer ? <FooterLink to="/mis-compras">Mis compras</FooterLink> : null}
            {user && !isCustomer ? <FooterLink to="/admin">Panel de administración</FooterLink> : null}
          </Column>

          <Column title="Contacto">
            <FooterLink href={whatsappUrl('Hola, tengo una consulta sobre sus snacks.')}>Escríbenos por WhatsApp</FooterLink>
            <FooterLink href={site.social[0].url}>Síguenos en Instagram</FooterLink>
          </Column>
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            pt: 3,
            borderTop: '1px solid rgba(246, 242, 231, 0.14)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 1,
            color: 'rgba(246, 242, 231, 0.6)',
            fontSize: '0.8125rem',
          }}
        >
          <span>
            © {new Date().getFullYear()} {site.name}. Todos los derechos reservados.
          </span>
          <span>Hecho con cariño para ellos.</span>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
