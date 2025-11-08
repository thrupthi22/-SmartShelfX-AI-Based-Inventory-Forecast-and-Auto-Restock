import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import {
    Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Chip, IconButton, CircularProgress
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SecurityIcon from '@mui/icons-material/Security';

const drawerWidth = 240;

function AdminUsersPage() {
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
               navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (id) => {
        try {
            await api.put(`/users/${id}/promote`);
            fetchUsers(); // Refresh list
        } catch (err) {
            alert("Failed to promote user.");
        }
    };

    const handleDemote = async (id) => {
         try {
            await api.put(`/users/${id}/demote`);
            fetchUsers(); // Refresh list
        } catch (err) {
            alert("Failed to demote user.");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    // Helper to style roles
    const getRoleChip = (role) => {
        let color = 'default';
        if (role === 'ADMIN') color = 'error';
        if (role === 'STORE_MANAGER') color = 'warning';
        if (role === 'USER') color = 'success';
        return <Chip label={role} color={color} size="small" />;
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
                        SmartShelf Admin
                    </Typography>
                </Toolbar>
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/admin-dashboard">
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/admin-users" selected>
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="User Management" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
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
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        User Management
                    </Typography>
                    <IconButton onClick={toggleTheme} color="inherit">
                        {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper' }}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'primary.main' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email / Username</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell sx={{ fontWeight: 'medium' }}>{user.email}</TableCell>
                                            <TableCell>{user.location || 'N/A'}</TableCell>
                                            <TableCell>{getRoleChip(user.role)}</TableCell>
                                            <TableCell>
                                                {user.role === 'USER' && (
                                                    <Button
                                                        variant="contained"
                                                        color="warning"
                                                        size="small"
                                                        startIcon={<SecurityIcon />}
                                                        onClick={() => handlePromote(user.id)}
                                                    >
                                                        Promote to Manager
                                                    </Button>
                                                )}
                                                {user.role === 'STORE_MANAGER' && (
                                                     <Button
                                                        variant="outlined"
                                                        color="info"
                                                        size="small"
                                                        onClick={() => handleDemote(user.id)}
                                                    >
                                                        Demote to User
                                                    </Button>
                                                )}
                                                {user.role === 'ADMIN' && (
                                                    <Typography variant="caption" color="text.secondary">No actions</Typography>
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

export default AdminUsersPage;



