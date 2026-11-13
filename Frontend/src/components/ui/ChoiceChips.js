import React from 'react';
import { Box } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { color, radius } from '../../theme/tokens';

/**
 * Grupo de opciones tipo "chip". Con `multiple` devuelve un arreglo;
 * sin él devuelve un solo valor y permite deseleccionar tocando de nuevo.
 */
const ChoiceChips = ({ options, value, onChange, multiple = false, label, size = 'medium' }) => {
  const isSelected = (option) => (multiple ? (value || []).includes(option) : value === option);

  const toggle = (option) => {
    if (multiple) {
      const current = value || [];
      onChange(current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
    } else {
      onChange(value === option ? '' : option);
    }
  };

  return (
    <Box role="group" aria-label={label} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map((option) => {
        const selected = isSelected(option);
        return (
          <Box
            key={option}
            component="button"
            type="button"
            aria-pressed={selected}
            onClick={() => toggle(option)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              minHeight: size === 'small' ? 36 : 42,
              px: selected ? 1.5 : 2,
              border: '1px solid',
              borderColor: selected ? color.olive[600] : color.lineStrong,
              borderRadius: `${radius.pill}px`,
              bgcolor: selected ? color.olive[100] : color.surface,
              color: selected ? color.olive[700] : color.inkSoft,
              font: 'inherit',
              fontWeight: 600,
              fontSize: '0.9063rem',
              cursor: 'pointer',
              transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 120ms ease',
              '&:hover': { borderColor: selected ? color.olive[600] : color.inkSoft, color: selected ? color.olive[700] : color.ink },
              '&:active': { transform: 'scale(0.96)' },
            }}
          >
            {selected && <CheckRoundedIcon sx={{ fontSize: 16 }} />}
            {option}
          </Box>
        );
      })}
    </Box>
  );
};

export default ChoiceChips;
