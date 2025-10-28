// In src/components/DashboardPage.js

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

// --- NEW MUI IMPORTS ---
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
// --- END NEW IMPORTS ---

// --- NEW: Style for the Modal (MUI's <Box> component) ---
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4, // padding
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '', category: '', quantity: 0, price: 0.0, supplier: '',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
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
    navigate('/login');
  };

  // --- Create Modal Functions ---
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
      fetchProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      setError("Failed to create product.");
    }
  };

  // --- Delete Function ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product.");
      }
    }
  };

  // --- Edit Modal Functions ---
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
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product.");
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* 1. NEW: Professional AppBar (Navigation Bar) */}
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }} // Pushes other items to the right
          >
            SmartShelf Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. NEW: Main Content Area */}
      <Container component="main" sx={{ mt: 10, p: 3 }}> {/* mt: 10 adds margin-top to clear the appbar */}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Welcome to your inventory!</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenCreateModal}
          >
            + Add New Product
          </Button>
        </Box>

        {/* 3. NEW: Loading and Error states */}
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
        {error && <Typography color="error" align="center" sx={{ my: 3 }}>{error}</Typography>}

        {/* 4. NEW: Table wrapped in Paper for a "card" effect */}
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
                      <TableCell>{product.quantity}</TableCell>
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
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleDelete(product.id)}
                        >
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

        {/* 5. NEW: "Create" Modal using MUI components */}
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

        {/* 6. NEW: "Edit" Modal using MUI components */}
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

      </Container>
    </Box>
  );
}

export default DashboardPage;