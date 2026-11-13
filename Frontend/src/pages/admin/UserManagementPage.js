import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, InputAdornment, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/formatCurrency';
import { color } from '../../theme/tokens';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';
import StatusChip from '../../components/ui/StatusChip';
import Panel from '../../components/admin/Panel';
import StatTile, { StatGrid } from '../../components/admin/StatTile';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const isRecent = (user) => new Date(user.fechaRegistro) > new Date(Date.now() - WEEK);
const initials = (user) => `${user.nombre?.charAt(0) || ''}${user.apellido?.charAt(0) || ''}`.toUpperCase();

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setUsers(await adminService.getUsers());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => [user.nombre, user.apellido, user.email].some((value) => (value || '').toLowerCase().includes(term)));
  }, [users, searchTerm]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const newThisWeek = users.filter(isRecent).length;

  if (status === 'error') {
    return (
      <EmptyState
        title="No pudimos cargar los clientes"
        description="Comprueba que el backend esté en marcha y que tu sesión de administrador siga activa."
        action={
          <Button onClick={load} variant="contained" startIcon={<RefreshRoundedIcon />}>
            Reintentar
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Cuentas registradas en la tienda."
        actions={
          <Button onClick={load} variant="outlined" startIcon={<RefreshRoundedIcon />} disabled={status === 'loading'}>
            Actualizar
          </Button>
        }
      />

      <StatGrid>
        <StatTile label="Clientes" value={users.length.toLocaleString('es-PE')} hint="Total de cuentas" loading={status === 'loading'} />
        <StatTile label="Nuevos esta semana" value={newThisWeek.toLocaleString('es-PE')} hint="Registrados en los últimos 7 días" loading={status === 'loading'} />
      </StatGrid>

      <Panel padded={false}>
        <Box sx={{ p: 2.5, borderBottom: `1px solid ${color.line}` }}>
          <TextField
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(0);
            }}
            placeholder="Buscar por nombre o correo"
            size="small"
            sx={{ width: { xs: '100%', sm: 340 } }}
            slotProps={{
              htmlInput: { 'aria-label': 'Buscar clientes', type: 'search' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {status === 'ready' && filtered.length === 0 ? (
          <EmptyState compact icon={<GroupOutlinedIcon />} title={users.length === 0 ? 'Aún no hay clientes' : 'Sin resultados'} description={users.length === 0 ? 'Cuando alguien cree una cuenta aparecerá aquí.' : 'Ningún cliente coincide con la búsqueda.'} />
        ) : (
          <>
            <TableContainer>
              <Table aria-label="Clientes registrados">
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Correo</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Registro</TableCell>
                    <TableCell align="right">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {status === 'loading'
                    ? [0, 1, 2, 3, 4].map((i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4}>
                            <Skeleton height={32} />
                          </TableCell>
                        </TableRow>
                      ))
                    : paginated.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                              <Avatar sx={{ width: 36, height: 36, bgcolor: color.olive[100], color: color.olive[700], fontSize: '0.8125rem', fontWeight: 700 }}>{initials(user) || '?'}</Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography noWrap sx={{ fontWeight: 600 }}>
                                  {user.nombre} {user.apellido}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap component="p" sx={{ display: { sm: 'none' } }}>
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: color.inkSoft }}>{user.email}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: color.inkSoft }}>{formatDate(user.fechaRegistro)}</TableCell>
                          <TableCell align="right">
                            <StatusChip size="small" tone={isRecent(user) ? 'success' : 'neutral'} label={isRecent(user) ? 'Nuevo' : 'Activo'} />
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_event, next) => setPage(next)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            />
          </>
        )}
      </Panel>
    </>
  );
};

export default UserManagementPage;
