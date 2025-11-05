// In src/components/DashboardPage.js

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

// --- MUI IMPORTS ---
import {
  AppBar, Box, Button, Container, CssBaseline, Modal, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar,
  Typography, Paper, CircularProgress, FormControl, InputLabel, Select,
  MenuItem, Grid,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt'; // Filter icon
import ClearIcon from '@mui/icons-material/Clear'; // Clear icon
// --- END NEW IMPORTS ---

// --- Modal Style ---
const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 400,
  bgcolor: 'background.paper', border: '2px solid #000',
  boxShadow: 24, p: 4, display: 'flex', flexDirection: 'column', gap: 2,
};

function DashboardPage() {
  // --- State Variables ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // CRUD Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ productName: '', category: '', quantity: 0, price: 0.0, supplier: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Sales Modal State
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [newSale, setNewSale] = useState({ productId: '', quantitySold: 0 });

  // Filter State
  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    maxStock: '',
  });

  // --- Data Fetching ---
  useEffect(() => {
    fetchProducts();
  }, []); // Runs once on load

  const fetchProducts = async (currentFilters = filters) => {
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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // --- Product "Create" Functions ---
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewProduct({ productName: '', category: '', quantity: 0, price: 0.0, supplier: '' });
  };
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      handleCloseCreateModal();
      fetchProducts(filters); // Refresh list
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Failed to create product.");
    }
  };

  // --- Product "Delete" Function ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(filters); // Refresh list
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product.");
      }
    }
  };

  // --- Product "Edit" Functions ---
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
      fetchProducts(filters); // Refresh list
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product.");
    }
  };

  // --- "Record Sale" Functions ---
  const handleOpenSaleModal = () => setIsSaleModalOpen(true);
  const handleCloseSaleModal = () => {
    setIsSaleModalOpen(false);
    setNewSale({ productId: '', quantitySold: 0 });
  };
  const handleSaleFormChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sales', newSale);
      handleCloseSaleModal();
      fetchProducts(filters); // Refresh product list
    } catch (err) {
      console.error("Error recording sale:", err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Failed to record sale.");
      }
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
    fetchProducts(clearedFilters); // Fetch with the cleared filters
  };

  // --- RENDER LOGIC ---
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Store Manager Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 10, p: 3 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5">Inventory Management</Typography>
          <Box>
            <Button variant="contained" color="success" onClick={handleOpenSaleModal} sx={{ mr: 2 }}>
              Record Sale
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
              + Add New Product
            </Button>
          </Box>
        </Box>

        {/* --- FILTER BAR --- */}
        <Paper sx={{ p: 2, mb: 3 }}>
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

        {/* --- Product Table --- */}
        {!loading && !error && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
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
                      <TableCell>{product.productName}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell sx={{ color: product.quantity < 20 ? 'red' : 'inherit', fontWeight: product.quantity < 20 ? 'bold' : 'normal' }}>
                        {product.quantity}
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.supplier}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleOpenEditModal(product)}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(product.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* --- All Modals --- */}
        <Modal open={isCreateModalOpen} onClose={handleCloseCreateModal}>
          <Box component="form" onSubmit={handleCreateSubmit} sx={modalStyle}>
            <Typography variant="h6">Add New Product</Typography>
            <TextField name="productName" label="Product Name" value={newProduct.productName} onChange={handleCreateFormChange} required fullWidth />
            <TextField name="category" label="Category" value={newProduct.category} onChange={handleCreateFormChange} fullWidth />
            <TextField name="quantity" label="Quantity" type="number" value={newProduct.quantity} onChange={handleCreateFormChange} required fullWidth />
            <TextField name="price" label="Price" type="number" inputProps={{ step: "0.01" }} value={newProduct.price} onChange={handleCreateFormChange} required fullWidth />
            <TextField name="supplier" label="Supplier" value={newProduct.supplier} onChange={handleCreateFormChange} fullWidth />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseCreateModal}>Cancel</Button>
              <Button variant="contained" type="submit">Create</Button>
            </Box>
          </Box>
        </Modal>

        <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
          <Box component="form" onSubmit={handleUpdateSubmit} sx={modalStyle}>
            <Typography variant="h6">Edit Product (ID: {editingProduct?.id})</Typography>
            <TextField name="productName" label="Product Name" value={editingProduct?.productName || ''} onChange={handleEditFormChange} required fullWidth />
            <TextField name="category" label="Category" value={editingProduct?.category || ''} onChange={handleEditFormChange} fullWidth />
            <TextField name="quantity" label="Quantity" type="number" value={editingProduct?.quantity || 0} onChange={handleEditFormChange} required fullWidth />
            <TextField name="price" label="Price" type="number" inputProps={{ step: "0.01" }} value={editingProduct?.price || 0.0} onChange={handleEditFormChange} required fullWidth />
            <TextField name="supplier" label="Supplier" value={editingProduct?.supplier || ''} onChange={handleEditFormChange} fullWidth />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseEditModal}>Cancel</Button>
              <Button variant="contained" type="submit">Save Changes</Button>
            </Box>
          </Box>
        </Modal>

        <Modal open={isSaleModalOpen} onClose={handleCloseSaleModal}>
          <Box component="form" onSubmit={handleSaleSubmit} sx={modalStyle}>
            <Typography variant="h6">Record New Sale</Typography>
            <FormControl fullWidth required>
              <InputLabel id="product-select-label">Product</InputLabel>
              <Select
                labelId="product-select-label"
                id="productId"
                name="productId"
                value={newSale.productId}
                label="Product"
                onChange={handleSaleFormChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.productName} (In Stock: {product.quantity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="quantitySold"
              label="Quantity Sold"
              type="number"
              value={newSale.quantitySold}
              onChange={handleSaleFormChange}
              required
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button variant="outlined" onClick={handleCloseSaleModal}>Cancel</Button>
              <Button variant="contained" color="success" type="submit">
                Submit Sale
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
}

export default DashboardPage;