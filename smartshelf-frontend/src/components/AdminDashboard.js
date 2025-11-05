// In src/components/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

// --- MUI IMPORTS ---
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

// --- Modal Style (Same as Manager's dashboard) ---
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- State for "Edit" Modal ---
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

  // --- "Edit" Modal Functions (Kept from plan) ---
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

  // --- RENDER LOGIC ---
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 10, p: 3 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Product Management (Admin)</Typography>
          {/* "Add" and "Record Sale" buttons are intentionally removed for Admin */}
        </Box>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
        {error && <Typography color="error" align="center" sx={{ my: 3 }}>{error}</Typography>}

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
                        {/* Admin only has "Edit" access */}
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleOpenEditModal(product)}
                        >
                          Edit
                        </Button>
                        {/* "Delete" button is intentionally removed */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* --- Edit Product Modal (Kept) --- */}
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

export default AdminDashboard;