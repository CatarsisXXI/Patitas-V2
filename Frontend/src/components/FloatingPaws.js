import React from 'react';
import { Box } from '@mui/material';

const FloatingPaws = () => {
  const pawStyle = {
    position: 'absolute',
    width: '50px',
    height: '50px',
    backgroundImage: `url('https://www.transparentpng.com/thumb/paw-print/JySpx6-paw-print-clipart-hd.png')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    opacity: 0.8,
    animation: 'float 25s linear infinite',

  };


  const paws = Array.from({ length: 15 }).map((_, i) => ({
    ...pawStyle,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 25}s`,
    transform: `scale(${Math.random() * 0.6 + 0.4})`,
  }));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        overflow: 'hidden',

        pointerEvents: 'none', // Ensure it doesn't interfere with clicks
      }}
    >
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
          }
        }
      `}</style>
      {paws.map((style, i) => (
        <Box key={i} sx={style} />
      ))}
    </Box>
  );
};

export default FloatingPaws;