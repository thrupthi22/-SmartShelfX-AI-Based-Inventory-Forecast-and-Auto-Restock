import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import {
    Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, CircularProgress, Modal, TextField, Grid,
} from '@mui/material';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Main Supplier Icon
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AiIcon from '@mui/icons-material/AutoAwesome';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const drawerWidth = 240;

// Modal Style (reused)
const modalStyle = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: 450,
    bgcolor: 'background.paper', border: '2px solid #000',
    boxShadow: 24, p: 4, display: 'flex', flexDirection: 'column', gap: 2,
};

function SupplierManagementPage() {
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    // Modal and Form States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState({
        id: null, name: '', contactPerson: '', email: '', phone: '', leadTimeDays: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            } else {
                setError("Failed to load supplier data.");
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

    // --- CRUD Handlers ---

    const handleOpenCreate = () => {
        setCurrentSupplier({ id: null, name: '', contactPerson: '', email: '', phone: '', leadTimeDays: '' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (supplier) => {
        setCurrentSupplier(supplier);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSupplier({ id: null, name: '', contactPerson: '', email: '', phone: '', leadTimeDays: '' });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentSupplier(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/suppliers/${currentSupplier.id}`, currentSupplier);
            } else {
                await api.post('/suppliers', currentSupplier);
            }
            handleCloseModal();
            fetchSuppliers();
        } catch (err) {
            console.error("Submit Error:", err);
            setError(err.response?.data || "Failed to save supplier data.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (err) {
                console.error("Delete Error:", err);
                alert("Failed to delete supplier.");
            }
        }
    };

    const dashboardLink = role === 'ADMIN' ? "/admin-dashboard" : "/dashboard";
    const title = isEditing ? 'Edit Supplier' : 'Add New Supplier';

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
                        Supplier Hub
                    </Typography>
                </Toolbar>
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to={dashboardLink}>
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
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
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/restock-requests">
                                <ListItemIcon><ShoppingCartCheckoutIcon /></ListItemIcon>
                                <ListItemText primary="Restock Requests" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton selected>
                                <ListItemIcon><LocalShippingIcon sx={{ color: 'info.main' }} /></ListItemIcon>
                                <ListItemText primary="Suppliers" />
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                       <LocalShippingIcon fontSize="large" color="info" /> Supplier Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenCreate}
                        sx={{ py: 1.5 }}
                    >
                        + Add New Supplier
                    </Button>
                </Box>

                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>}
                {error && <Typography color="error" align="center" sx={{ my: 3 }}>{error}</Typography>}

                {!loading && !error && (
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper' }}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'info.main' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact Person</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Lead Time (Days)</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {suppliers.map((supplier) => (
                                        <TableRow key={supplier.id} hover>
                                            <TableCell>{supplier.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 'medium' }}>{supplier.name}</TableCell>
                                            <TableCell>{supplier.contactPerson}</TableCell>
                                            <TableCell>{supplier.email}</TableCell>
                                            <TableCell>{supplier.phone}</TableCell>
                                            <TableCell align="right">{supplier.leadTimeDays}</TableCell>
                                            <TableCell align="center">
                                                <IconButton color="primary" size="small" onClick={() => handleOpenEdit(supplier)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton color="error" size="small" onClick={() => handleDelete(supplier.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Box>

            {/* --- Supplier Create/Edit Modal --- */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box component="form" onSubmit={handleSubmit} sx={modalStyle}>
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{title}</Typography>
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    <TextField
                        name="name" label="Supplier Name" value={currentSupplier.name} onChange={handleFormChange} required fullWidth
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                name="contactPerson" label="Contact Person" value={currentSupplier.contactPerson} onChange={handleFormChange} required fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="leadTimeDays" label="Lead Time (Days)" type="number" value={currentSupplier.leadTimeDays} onChange={handleFormChange} fullWidth
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        name="email" label="Email" type="email" value={currentSupplier.email} onChange={handleFormChange} required fullWidth
                    />
                    <TextField
                        name="phone" label="Phone" value={currentSupplier.phone} onChange={handleFormChange} fullWidth
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button variant="outlined" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="contained" color="primary" type="submit">
                            {isEditing ? 'Save Changes' : 'Create Supplier'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* --- END Supplier Modal --- */}
        </Box>
    );
}

export default SupplierManagementPage;