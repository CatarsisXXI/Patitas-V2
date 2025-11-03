import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getProductos();
        // Take only first 6 products for the carousel,
        setProducts(response.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [products.length]);

  const handleProductClick = (productId) => {
    navigate(`/productos/${productId}`);
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        <Box sx={{ pt: 2 }}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No hay productos disponibles
        </Typography>
      </Box>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}
      onClick={() => handleProductClick(currentProduct.productoID)}
    >
      {/* Product Image */}
      <CardMedia
  component="img"
  height="180"
  image={
    currentProduct.imagenURL
      ? `${process.env.REACT_APP_API_URL || 'http://localhost:5288'}${currentProduct.imagenURL}`
      : 'https://via.placeholder.com/300x200?text=Producto'
  }
  alt={currentProduct.nombre}
  sx={{
    borderRadius: '12px 12px 0 0',
    objectFit: 'cover'
  }}
/>

      {/* Product Info */}
      <CardContent sx={{ p: 2, pb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: '#5D4E37',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {currentProduct.nombre}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#7D6B5D',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            fontSize: '0.85rem'
          }}
        >
          {currentProduct.descripcion}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#D4A574',
              fontSize: '1.1rem'
            }}
          >
            S/. {currentProduct.precio}
          </Typography>

          <Chip
            label={currentProduct.categoriaNombre}
            size="small"
            sx={{
              backgroundColor: 'rgba(212, 165, 116, 0.1)',
              color: '#D4A574',
              fontSize: '0.7rem',
              height: '20px'
            }}
          />
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating
            value={4.5}
            readOnly
            size="small"
            sx={{
              fontSize: '1rem',
              color: '#FFD700'
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: '#7D6B5D',
              fontSize: '0.8rem'
            }}
          >
            (4.5)
          </Typography>
        </Box>
      </CardContent>

      {/* Carousel Indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 0.5
        }}
      >
        {products.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: currentIndex === index ? '#D4A574' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
          />
        ))}
      </Box>

      {/* Stock Badge */}
      {currentProduct.stock > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: currentProduct.stock > 10 ? '#A8B5A0' : '#D4A574',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 600
          }}
        >
          {currentProduct.stock > 10 ? 'En Stock' : 'Últimas unidades'}
        </Box>
      )}
    </Box>
  );
};

export default ProductCarousel;