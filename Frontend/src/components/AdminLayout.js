import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import adminTheme from '../adminTheme';

const AdminLayout = ({ children }) => {
  return (
    <ThemeProvider theme={adminTheme}>
      <Box component="main" sx={{ p: 3, mt: '64px', backgroundColor: 'background.default', minHeight: '100vh' }}>
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;