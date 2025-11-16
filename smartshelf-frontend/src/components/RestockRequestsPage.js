import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import {
    Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, CircularProgress, Button
} from '@mui/material';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AiIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import InventoryIcon from '@mui/icons-material/Inventory';


const drawerWidth = 240;

function RestockRequestsPage() {
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchPOs();
    }, []);

    const fetchPOs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/pos');
            setPurchaseOrders(response.data);
        } catch (err) {
            console.error("Failed to fetch Purchase Orders", err);
             if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
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

    // --- Action Handlers ---
    const handleApprove = async (id) => {
        try {
            // This calls the backend: PENDING -> APPROVED
            await api.put(`/pos/${id}/approve`);
            alert('Purchase Order approved and sent for ordering!');
            fetchPOs(); // Refresh list
        } catch (err) {
            console.error("Failed to approve PO:", err);
            alert("Failed to approve PO.");
        }
    };

    const handleReceive = async (id) => {
        try {
            // This calls the backend: APPROVED/ORDERED -> RECEIVED (and updates inventory)
            await api.put(`/pos/${id}/receive`);
            alert('Stock received! Inventory updated successfully!');
            fetchPOs(); // Refresh list and show new RECEIVED status
        } catch (err) {
            console.error("Failed to receive PO:", err);
            alert("Failed to mark as received.");
        }
    };

    // Helper for status chip color and icon
    const getStatusChip = (status) => {
        let chipColor = 'default';
        let chipIcon = null;

        if (status === 'PENDING') {
            chipColor = 'warning';
            chipIcon = <SendIcon />;
        } else if (status === 'APPROVED' || status === 'ORDERED') { // <<< FIX: Using APPROVED/ORDERED for in-transit
            chipColor = 'info';
            chipIcon = <InventoryIcon />;
        } else if (status === 'RECEIVED') { // <<< FIX: Using RECEIVED for final status
            chipColor = 'success';
            chipIcon = <CheckCircleIcon />;
        }

        return (
            <Chip
                label={status}
                color={chipColor}
                icon={chipIcon}
                variant="filled"
                size="small"
                sx={{ fontWeight: 'bold' }}
            />
        );
    };

    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <CssBaseline />
            {/* SIDEBAR */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper' },
                }}
            >
                <Toolbar sx={{ p: 2 }}>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Restock Hub
                    </Typography>
                </Toolbar>
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {/* Dynamic Home Link based on Role */}
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to={role === 'ADMIN' ? "/admin-dashboard" : "/dashboard"}>
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>

                        {/* Admin Only Link */}
                         {role === 'ADMIN' && (
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/admin-users">
                                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                                    <ListItemText primary="User Management" />
                                </ListItemButton>
                            </ListItem>
                        )}

                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/forecast">
                                <ListItemIcon><AiIcon /></ListItemIcon>
                                <ListItemText primary="AI Forecast" />
                            </ListItemButton>
                        </ListItem>
                        {/* THIS PAGE IS ACTIVE */}
                         <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/restock-requests" selected>
                                <ListItemIcon><ShoppingCartCheckoutIcon sx={{ color: 'warning.main' }} /></ListItemIcon>
                                <ListItemText primary="Restock Requests" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={toggleTheme}>
                                <ListItemIcon>
                                    {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                                </ListItemIcon>
                                <ListItemText primary={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemIcon><LogoutIcon /></ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>

            {/* MAIN CONTENT */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <ShoppingCartCheckoutIcon fontSize="large" color="warning" /> Restock Requests
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage and process Purchase Orders generated by the forecast system.
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper' }}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'warning.main' }}> {/* Warning/Orange header for restock urgency */}
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>PO ID</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Supplier</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Quantity</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created At</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Process</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {purchaseOrders.map((po) => (
                                        <TableRow key={po.id} hover>
                                            <TableCell>{po.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 'medium' }}>{po.product.productName}</TableCell>
                                            <TableCell>{po.product.supplier}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{po.quantity}</TableCell>
                                            <TableCell>{formatDate(po.createdAt)}</TableCell>
                                            <TableCell align="center">
                                                {getStatusChip(po.status)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {po.status === 'PENDING' && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() => handleApprove(po.id)}
                                                    >
                                                        Approve & Order
                                                    </Button>
                                                )}
                                                {(po.status === 'APPROVED' || po.status === 'ORDERED') && ( // <<< FIX: Check for both approved/ordered
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        onClick={() => handleReceive(po.id)}
                                                    >
                                                        Mark as Received
                                                    </Button>
                                                )}
                                                {po.status === 'RECEIVED' && ( // <<< FIX: Check for RECEIVED
                                                    <Chip label="Done" color="success" size="small" variant="outlined" />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}

export default RestockRequestsPage;