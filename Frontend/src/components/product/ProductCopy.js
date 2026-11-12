import React from 'react';
import { Box, Typography } from '@mui/material';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { toBlocks } from '../../lib/productCopy';
import { color, radius } from '../../theme/tokens';

const ICONS = {
  perfil: <SpaOutlinedIcon fontSize="small" />,
  composicion: <ScienceOutlinedIcon fontSize="small" />,
  beneficios: <FavoriteBorderRoundedIcon fontSize="small" />,
  recomendado: <PetsRoundedIcon fontSize="small" />,
  evitar: <ReportProblemOutlinedIcon fontSize="small" />,
};

/** Párrafos y listas de una sección de la ficha de producto. */
export const CopyBlocks = ({ body }) => (
  <>
    {toBlocks(body).map((block, index) =>
      block.type === 'list' ? (
        <Box key={index} component="ul" sx={{ m: 0, mb: 1, pl: 0, listStyle: 'none', display: 'grid', gap: 0.75 }}>
          {block.items.map((item) => (
            <Box key={item} component="li" sx={{ position: 'relative', pl: 2.5, color: 'text.secondary', '&::before': { content: '""', position: 'absolute', left: 4, top: '0.7em', width: 6, height: 6, borderRadius: '50%', bgcolor: color.olive[300] } }}>
              {item}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography key={index} color="text.secondary" sx={{ mb: 1, '&:last-child': { mb: 0 } }}>
          {block.text}
        </Typography>
      )
    )}
  </>
);

/** Sección de la ficha: icono, título y contenido. Las precauciones se destacan. */
export const CopySection = ({ section }) => {
  const caution = section.key === 'evitar';
  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gridTemplateColumns: '40px 1fr',
        columnGap: 2,
        p: caution ? 2.5 : 0,
        borderRadius: caution ? `${radius.md}px` : 0,
        bgcolor: caution ? color.warning.tint : 'transparent',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 40,
          height: 40,
          display: 'grid',
          placeItems: 'center',
          borderRadius: `${radius.sm}px`,
          bgcolor: caution ? 'rgba(138, 90, 11, 0.12)' : color.olive[100],
          color: caution ? color.warning.main : color.olive[700],
        }}
      >
        {ICONS[section.key]}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h6" component="h3" sx={{ mb: 0.75, lineHeight: '40px', color: caution ? color.warning.main : 'text.primary' }}>
          {section.title}
        </Typography>
        <CopyBlocks body={section.body} />
      </Box>
    </Box>
  );
};
