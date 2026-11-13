import { createTheme, alpha } from '@mui/material/styles';
import { color, radius, shadow, font, ease } from './tokens';

const transition = (props) => props.map((p) => `${p} 180ms ${ease.css.out}`).join(', ');

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: color.olive[600], light: color.olive[500], dark: color.olive[700], contrastText: color.surface },
    secondary: { main: color.cocoa, light: color.inkSoft, dark: color.ink, contrastText: color.surface },
    success: { main: color.success.main, contrastText: color.surface },
    warning: { main: color.warning.main, contrastText: color.surface },
    error: { main: color.danger.main, contrastText: color.surface },
    info: { main: color.info.main, contrastText: color.surface },
    background: { default: color.paper, paper: color.surface },
    text: { primary: color.ink, secondary: color.inkSoft, disabled: alpha(color.ink, 0.38) },
    divider: color.line,
    action: {
      hover: alpha(color.cocoa, 0.05),
      selected: alpha(color.olive[600], 0.1),
      focus: alpha(color.olive[600], 0.14),
      disabledBackground: alpha(color.cocoa, 0.08),
      disabled: alpha(color.ink, 0.38),
    },
  },
  shape: { borderRadius: radius.sm },
  typography: {
    fontFamily: font.body,
    h1: { fontFamily: font.display, fontWeight: 500, fontSize: 'clamp(2.5rem, 1.6rem + 4vw, 4.5rem)', lineHeight: 1.02, letterSpacing: '-0.03em' },
    h2: { fontFamily: font.display, fontWeight: 500, fontSize: 'clamp(2rem, 1.5rem + 2.2vw, 3.1rem)', lineHeight: 1.08, letterSpacing: '-0.025em' },
    h3: { fontFamily: font.display, fontWeight: 500, fontSize: 'clamp(1.6rem, 1.3rem + 1.2vw, 2.2rem)', lineHeight: 1.15, letterSpacing: '-0.02em' },
    h4: { fontFamily: font.display, fontWeight: 500, fontSize: 'clamp(1.3rem, 1.15rem + 0.6vw, 1.6rem)', lineHeight: 1.2, letterSpacing: '-0.015em' },
    h5: { fontFamily: font.body, fontWeight: 650, fontSize: '1.125rem', lineHeight: 1.35, letterSpacing: '-0.01em' },
    h6: { fontFamily: font.body, fontWeight: 650, fontSize: '1rem', lineHeight: 1.4, letterSpacing: '-0.005em' },
    subtitle1: { fontWeight: 500, fontSize: '1.0625rem', lineHeight: 1.55 },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.45 },
    body1: { fontSize: '1rem', lineHeight: 1.65 },
    body2: { fontSize: '0.9063rem', lineHeight: 1.6 },
    caption: { fontSize: '0.8125rem', lineHeight: 1.45 },
    overline: { fontSize: '0.75rem', fontWeight: 650, letterSpacing: '0.12em', lineHeight: 1.4 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0, fontSize: '0.9375rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: color.paper },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': { outline: `2px solid ${color.olive[600]}`, outlineOffset: 2 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius.pill,
          padding: '10px 22px',
          minHeight: 44,
          transition: transition(['background-color', 'border-color', 'color', 'box-shadow', 'transform']),
          '&:active': { transform: 'scale(0.97)' },
        },
        sizeSmall: { padding: '6px 14px', minHeight: 36, fontSize: '0.875rem' },
        sizeLarge: { padding: '14px 28px', minHeight: 52, fontSize: '1rem' },
        containedPrimary: {
          boxShadow: `0 1px 0 ${alpha(color.white, 0.18)} inset, 0 6px 16px -8px ${alpha(color.olive[900], 0.7)}`,
          '&:hover': { backgroundColor: color.olive[700], boxShadow: `0 1px 0 ${alpha(color.white, 0.18)} inset, 0 10px 22px -10px ${alpha(color.olive[900], 0.8)}` },
        },
        containedSecondary: {
          '&:hover': { backgroundColor: color.ink },
        },
        outlined: {
          borderColor: color.lineStrong,
          color: color.ink,
          '&:hover': { borderColor: color.ink, backgroundColor: alpha(color.cocoa, 0.04) },
        },
        text: {
          color: color.ink,
          '&:hover': { backgroundColor: alpha(color.cocoa, 0.06) },
        },
        textPrimary: { color: color.olive[600] },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: color.inkSoft,
          transition: transition(['background-color', 'color', 'transform']),
          '&:hover': { backgroundColor: alpha(color.cocoa, 0.07), color: color.ink },
          '&:active': { transform: 'scale(0.92)' },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: color.line },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: radius.lg, border: `1px solid ${color.line}`, backgroundColor: color.surface },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.xs, fontWeight: 600, fontSize: '0.8125rem', height: 28 },
        sizeSmall: { height: 24, fontSize: '0.75rem' },
        outlined: { borderColor: color.lineStrong },
        filled: { backgroundColor: color.sunken, color: color.ink },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          backgroundColor: color.surface,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: color.lineStrong, transition: transition(['border-color']) },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: color.inkSoft },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: color.olive[600], borderWidth: 2 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: color.danger.main },
        },
        input: { padding: '13px 14px' },
        inputSizeSmall: { padding: '9px 12px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: color.inkMuted, '&.Mui-focused': { color: color.olive[700] } },
        outlined: { transform: 'translate(14px, 13px) scale(1)', '&.MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.78)' } },
        sizeSmall: { transform: 'translate(12px, 9px) scale(1)' },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { marginLeft: 2, marginTop: 6, fontSize: '0.8125rem' } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: radius.lg, boxShadow: shadow.lg, backgroundColor: color.surface },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { '&:not(.MuiBackdrop-invisible)': { backgroundColor: alpha(color.ink, 0.42), backdropFilter: 'blur(3px)' } },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: color.paper, boxShadow: shadow.lg } },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: radius.md, border: `1px solid ${color.line}`, boxShadow: shadow.md, marginTop: 8 },
        list: { padding: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: radius.xs,
          minHeight: 40,
          fontSize: '0.9375rem',
          '&.Mui-selected': { backgroundColor: color.olive[50], '&:hover': { backgroundColor: color.olive[100] } },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true, enterDelay: 400 },
      styleOverrides: {
        tooltip: { backgroundColor: color.ink, color: color.paper, fontSize: '0.8125rem', fontWeight: 500, borderRadius: radius.xs, padding: '6px 10px' },
        arrow: { color: color.ink },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius.sm, alignItems: 'center', fontSize: '0.9375rem' },
        standardError: { backgroundColor: color.danger.tint, color: color.danger.main },
        standardSuccess: { backgroundColor: color.success.tint, color: color.success.main },
        standardWarning: { backgroundColor: color.warning.tint, color: color.warning.main },
        standardInfo: { backgroundColor: color.info.tint, color: color.info.main },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { fontWeight: 700, fontSize: '0.6875rem', minWidth: 18, height: 18, fontVariantNumeric: 'tabular-nums' },
      },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: {
        root: { backgroundColor: alpha(color.cocoa, 0.08), borderRadius: radius.xs },
        rounded: { borderRadius: radius.md },
      },
    },
    MuiSlider: {
      styleOverrides: {
        rail: { opacity: 1, backgroundColor: color.line },
        thumb: {
          width: 18,
          height: 18,
          backgroundColor: color.surface,
          border: `2px solid ${color.olive[600]}`,
          '&:hover, &.Mui-focusVisible': { boxShadow: shadow.focus },
        },
        valueLabel: { backgroundColor: color.ink, borderRadius: radius.xs, fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: color.line, padding: '14px 16px' },
        head: { fontWeight: 650, fontSize: '0.8125rem', color: color.inkMuted, backgroundColor: 'transparent' },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: { root: { color: color.olive[700], fontWeight: 600, textUnderlineOffset: 3 } },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: color.line } } },
    MuiCheckbox: { styleOverrides: { root: { color: color.lineStrong } } },
    MuiRadio: { styleOverrides: { root: { color: color.lineStrong } } },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0 },
      styleOverrides: { root: { backgroundColor: 'transparent', '&::before': { display: 'none' } } },
    },
  },
});

export default theme;
