import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import {
    Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, CircularProgress
} from '@mui/material';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AiIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

function ForecastPage() {
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchForecast();
    }, []);

    const fetchForecast = async () => {
        setLoading(true);
        try {
            const response = await api.get('/forecast');
            setForecasts(response.data);
        } catch (err) {
            console.error("Failed to fetch forecast", err);
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

    // Helper for status chip color
    const getStatusChip = (status) => {
        return (
            <Chip
                label={status}
                color={status === 'RESTOCK NEEDED' ? 'error' : 'success'}
                variant={status === 'RESTOCK NEEDED' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 'bold' }}
            />
        );
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <CssBaseline />
            {/* SIDEBAR (Reused from Admin/Manager Dashboard) */}
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
                        SmartShelf AI
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
                            <ListItemButton component={RouterLink} to="/sales-report">
                                <ListItemIcon><BarChartIcon /></ListItemIcon>
                                <ListItemText primary="Sales Report" />
                            </ListItemButton>
                        </ListItem>
                         {/* THIS PAGE IS ACTIVE */}
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/forecast" selected>
                                <ListItemIcon><AiIcon sx={{ color: '#7c4dff' }} /></ListItemIcon> {/* Special color for AI */}
                                <ListItemText primary="AI Forecast" />
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
                   <AiIcon fontSize="large" sx={{ color: '#7c4dff' }} /> AI Demand Forecast
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Predictive analysis based on historical sales data to prevent stockouts.
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: 3, bgcolor: 'background.paper' }}>
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: '#7c4dff' }}> {/* Purple header for AI theme */}
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product Name</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Current Stock</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Predicted Next Month Demand</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {forecasts.map((item) => (
                                        <TableRow key={item.productId} hover>
                                            <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                                                {item.productName}
                                            </TableCell>
                                            <TableCell align="right">{item.currentStock}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>{item.predictedDemand}</TableCell>
                                            <TableCell align="center">
                                                {getStatusChip(item.status)}
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

export default ForecastPage;