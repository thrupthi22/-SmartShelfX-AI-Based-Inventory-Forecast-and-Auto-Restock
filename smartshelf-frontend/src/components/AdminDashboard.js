import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// --- MUI IMPORTS ---
import {
  AppBar, Box, Button, Container, CssBaseline, Modal, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar,
  Typography, Paper, CircularProgress, Grid,
  // --- LAYOUT IMPORTS ---
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  // --- THEME IMPORTS ---
  useTheme
} from '@mui/material';

// --- ICONS ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People';
// --- NEW AI ICON ---
import AiIcon from '@mui/icons-material/AutoAwesome';

import { ThemeContext } from '../ThemeContext';

const drawerWidth = 240;

// --- Modal Style ---
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function AdminDashboard() {
  const theme = useTheme();
  const colorMode = useContext(ThemeContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    maxStock: '',
  });

  const fetchProducts = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (currentFilters.category) params.append('category', currentFilters.category);
    if (currentFilters.supplier) params.append('supplier', currentFilters.supplier);
    if (currentFilters.maxStock) params.append('maxStock', currentFilters.maxStock);

    try {
      const response = await api.get('/products', { params });
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      } else {
        setError("Failed to load inventory.");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // --- "Edit" Modal Functions ---
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await api.put(`/products/${editingProduct.id}`, editingProduct);
      handleCloseEditModal();
      fetchProducts(filters);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product.");
    }
  };

  // --- Filter Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onFilterSubmit = () => {
    fetchProducts(filters);
  };
  const onFilterClear = () => {
    const clearedFilters = { category: '', supplier: '', maxStock: '' };
    setFilters(clearedFilters);
    fetchProducts(clearedFilters);
  };

  // --- RENDER LOGIC ---
  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />

      {/* --- SIDEBAR --- */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper' },
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <img src="/logo192.png" alt="logo" style={{ width: 32, height: 32, marginRight: 12 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
            SmartShelf
          </Typography>
        </Toolbar>
        <Box sx={{ overflow: 'auto', p: 1 }}>
          <Typography variant="caption" sx={{ pl: 2, color: 'text.secondary' }}>NAVIGATION</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/admin-dashboard" selected>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItemButton>
            </ListItem>

            {/* --- NEW USER MANAGEMENT LINK --- */}
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/admin-users">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/sales-report">
                <ListItemIcon><BarChartIcon /></ListItemIcon>
                <ListItemText primary="Sales Report" />
              </ListItemButton>
            </ListItem>

            {/* --- NEW AI FORECAST LINK --- */}
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/forecast">
                <ListItemIcon><AiIcon /></ListItemIcon>
                <ListItemText primary="AI Forecast" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <List>
            {/* --- THEME TOGGLE BUTTON --- */}
            <ListItem disablePadding>
              <ListItemButton onClick={colorMode.toggleTheme}>
                <ListItemIcon>
                  {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </ListItemIcon>
                <ListItemText primary={theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
              </ListItemButton>
            </ListItem>

            {/* --- LOGOUT --- */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* --- END SIDEBAR --- */}

      {/* --- MAIN CONTENT AREA --- */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        {/* Header Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Admin Control Panel</Typography>
            <Typography variant="body1" color="text.secondary">Oversee products and manage system reports.</Typography>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/sales-report"
          >
            View Full Sales Report
          </Button>
        </Box>

        {/* --- FILTER BAR --- */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Filter by Category" name="category" value={filters.category} onChange={handleFilterChange} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Filter by Supplier" name="supplier" value={filters.supplier} onChange={handleFilterChange} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Show Stock <=" name="maxStock" type="number" value={filters.maxStock} onChange={handleFilterChange} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" onClick={onFilterSubmit} startIcon={<FilterAltIcon />}>
                Filter
              </Button>
              <Button fullWidth variant="outlined" onClick={onFilterClear} startIcon={<ClearIcon />}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
        {error && <Typography color="error" align="center" sx={{ my: 3 }}>{error}</Typography>}

        {/* --- Product Table (Admin version) --- */}
        {!loading && !error && (
          <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, bgcolor: 'background.paper' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Supplier</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow hover key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/40'}
                            alt={product.productName}
                            style={{ width: 40, height: 40, marginRight: 12, borderRadius: 4 }}
                          />
                          {product.productName}
                        </Box>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell sx={{ color: product.quantity < 20 ? (theme.palette.mode === 'dark' ? '#f77' : 'red') : 'inherit', fontWeight: product.quantity < 20 ? 'bold' : 'normal' }}>
                        {product.quantity}
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleOpenEditModal(product)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* --- Edit Product Modal --- */}
        <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
          <Box component="form" onSubmit={handleUpdateSubmit} sx={modalStyle}>
            <Typography variant="h6">Edit Product (ID: {editingProduct?.id})</Typography>
            <TextField name="productName" label="Product Name" value={editingProduct?.productName || ''} onChange={handleEditFormChange} required fullWidth />
            <TextField name="category" label="Category" value={editingProduct?.category || ''} onChange={handleEditFormChange} fullWidth />
            <TextField name="quantity" label="Quantity" type="number" value={editingProduct?.quantity || 0} onChange={handleEditFormChange} required fullWidth />
            <TextField name="price" label="Price" type="number" inputProps={{ step: "0.01" }} value={editingProduct?.price || 0.0} onChange={handleEditFormChange} required fullWidth />
            <TextField name="supplier" label="Supplier" value={editingProduct?.supplier || ''} onChange={handleEditFormChange} fullWidth />
            <TextField name="imageUrl" label="Image URL" value={editingProduct?.imageUrl || ''} onChange={handleEditFormChange} fullWidth />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseEditModal}>Cancel</Button>
              <Button variant="contained" type="submit">Save Changes</Button>
            </Box>
          </Box>
        </Modal>

      </Box>
    </Box>
  );
}

export default AdminDashboard;
