import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TablePagination,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Button  // ✅ Agregar Button aquí
} from '@mui/material';
import {
  People as PeopleIcon,
  Search,
  FilterList,
  Refresh,
  Email,
  CalendarToday,
  MoreVert
} from '@mui/icons-material';
import adminService from '../../services/adminService';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios. Asegúrate de que el backend está corriendo y que has iniciado sesión como administrador.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(user => 
    user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  const getRandomColor = (str) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main
    ];
    const index = str?.length % colors.length || 0;
    return colors[index];
  };

  const UserStatusChip = ({ user }) => {
    const isRecent = new Date(user.fechaRegistro) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return (
      <Chip
        label={isRecent ? 'Nuevo' : 'Activo'}
        color={isRecent ? 'success' : 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                width: 56,
                height: 56,
                mr: 2
              }}
            >
              <PeopleIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="800" gutterBottom>
                Gestión de Usuarios
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Administra y supervisa los usuarios registrados en la plataforma
              </Typography>
            </Box>
          </Box>
          
          <Tooltip title="Actualizar lista">
            <IconButton 
              onClick={fetchUsers}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" fontWeight="800" color="primary.main">
                  {users.length}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Usuarios Totales
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="div" fontWeight="800" color="success.main">
                  {users.filter(user => new Date(user.fechaRegistro) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Nuevos (7 días)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Search and Filters Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar usuarios por nombre, apellido o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              flexGrow: 1,
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Tooltip title="Filtros avanzados">
            <IconButton 
              sx={{
                border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                borderRadius: 2
              }}
            >
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Cargando usuarios...
            </Typography>
          </Box>
        </Box>
      ) : error ? (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
          action={
            <Button color="inherit" size="small" onClick={fetchUsers}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`
          }}
        >
          <TableContainer>
            <Table stickyHeader aria-label="tabla de usuarios">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    py: 3
                  }}>
                    USUARIO
                  </TableCell>
                  <TableCell sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    CONTACTO
                  </TableCell>
                  <TableCell sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    FECHA DE REGISTRO
                  </TableCell>
                  <TableCell sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    ESTADO
                  </TableCell>
                  <TableCell sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    ACCIONES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow 
                      hover 
                      key={user.id}
                      sx={{ 
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: getRandomColor(user.nombre),
                              width: 40,
                              height: 40,
                              fontWeight: 'bold',
                              fontSize: '0.9rem'
                            }}
                          >
                            {getInitials(user.nombre, user.apellido)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="600">
                              {`${user.nombre} ${user.apellido}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2">
                            {new Date(user.fechaRegistro).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(user.fechaRegistro).toLocaleTimeString('es-ES')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <UserStatusChip user={user} />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Más opciones">
                          <IconButton size="small" sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.3)}` }}>
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                      <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No se encontraron usuarios
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios registrados en el sistema'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            sx={{
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              '& .MuiTablePagination-toolbar': {
                minHeight: 60
              }
            }}
          />
        </Paper>
      )}
    </Container>
  );
};

export default UserManagementPage;