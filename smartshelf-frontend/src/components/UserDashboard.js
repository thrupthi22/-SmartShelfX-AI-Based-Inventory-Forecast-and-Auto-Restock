// In src/components/UserDashboard.js

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom'; // <-- THIS IS THE FIXED LINE
import ShoppingCart from './ShoppingCart';

// --- MUI IMPORTS ---
import {
  AppBar, Box, Button, Container, CssBaseline, Toolbar,
  Typography, Paper, CircularProgress, Grid,
  // --- NEW IMPORTS for Cards & Cart ---
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Badge,
  TextField
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';

function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- Cart State ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Filter State ---
  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    maxStock: '',
  });

  // --- Data Fetching ---
  useEffect(() => {
    fetchProducts(filters);
  }, []); // We will fix the warning here later

  const fetchProducts = async (currentFilters = filters) => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (currentFilters.category) params.append('category', currentFilters.category);
    if (currentFilters.supplier) params.append('supplier', currentFilters.supplier);
    // Don't use maxStock for user view

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
        setError("Failed to load products.");
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

  // --- Cart Logic ---
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleAddToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productToAdd.id);

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + 1, productToAdd.quantity);
        return prevCart.map((item) =>
          item.id === productToAdd.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prevCart, { ...productToAdd, quantity: 1, maxQuantity: productToAdd.quantity }];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.maxQuantity)) }
          : item
      )
    );
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const salePromises = cart.map((item) => {
        return api.post('/sales', {
          productId: item.id,
          quantitySold: item.quantity,
        });
      });

      await Promise.all(salePromises);

      setCart([]);
      setIsCartOpen(false);
      fetchProducts(filters);
      alert('Purchase successful! Thank you!');

    } catch (err) {
      console.error("Checkout error:", err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("Checkout failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartShelf Store
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open cart"
            onClick={toggleCart}
          >
            <Badge badgeContent={getCartItemCount()} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <ShoppingCart
        cart={cart}
        open={isCartOpen}
        onClose={toggleCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <Container component="main" sx={{ mt: 10, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Browse Products
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Filter by Category" name="category" value={filters.category} onChange={handleFilterChange} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Filter by Supplier" name="supplier" value={filters.supplier} onChange={handleFilterChange} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1 }}>
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

        {!loading && !error && (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.imageUrl || 'https://via.placeholder.com/150'}
                    alt={product.productName}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: product.quantity > 0 ? 'green' : 'red' }}>
                      {product.quantity > 0 ? `In Stock (${product.quantity})` : 'Out of Stock'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default UserDashboard;