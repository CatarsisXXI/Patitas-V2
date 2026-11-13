import { createTheme } from '@mui/material/styles';
import theme from './theme';
import { font } from './tokens';

// El panel comparte paleta y componentes con la tienda. Solo cambia la escala
// tipográfica: títulos en sans y más compactos, pensados para leer datos.
const heading = (size) => ({ fontFamily: font.body, fontWeight: 650, fontSize: size, lineHeight: 1.25, letterSpacing: '-0.015em' });

const adminTheme = createTheme(theme, {
  typography: {
    h1: heading('1.75rem'),
    h2: heading('1.5rem'),
    h3: heading('1.25rem'),
    h4: heading('1.125rem'),
  },
});

export default adminTheme;
