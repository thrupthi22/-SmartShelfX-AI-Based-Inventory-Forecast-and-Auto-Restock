// In src/components/ShoppingCart.js

import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

function ShoppingCart({
  cart,
  open,
  onClose,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout
}) {

  // Calculate the total price of items in the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{ width: 350, p: 2 }}
        role="presentation"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1 }} />

        <List>
          {cart.length === 0 ? (
            <ListItem>
              <ListItemText primary="Your cart is empty." />
            </ListItem>
          ) : (
            cart.map((item) => (
              <ListItem key={item.id} divider>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/40'}
                    alt={item.productName}
                    style={{ width: 40, height: 40, marginRight: 15, borderRadius: 4 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <ListItemText
                      primary={item.productName}
                      secondary={`$${item.price.toFixed(2)}`}
                    />
                    <TextField
                      type="number"
                      size="small"
                      label="Qty"
                      variant="outlined"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                      inputProps={{ min: 1, max: item.maxQuantity }} // Use maxQuantity
                      sx={{ width: '80px', mt: 1 }}
                    />
                  </Box>
                  <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFromCart(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))
          )}
        </List>

        {cart.length > 0 && (
          <Box sx={{ mt: 'auto', p: 2 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </Typography>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={onCheckout}
            >
              Proceed to Buy
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

export default ShoppingCart;