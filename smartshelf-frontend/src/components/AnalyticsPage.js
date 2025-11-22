import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import {
    Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, Paper, CircularProgress, Grid,
    useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import AiIcon from '@mui/icons-material/AutoAwesome';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AnalyticsIcon from '@mui/icons-material/Analytics';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const drawerWidth = 240;
const RADIAN = Math.PI / 180;

// Custom Label for Pie Chart slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

// Color palette for charts
const CHART_COLORS = ['#4f46e5', '#34d399', '#f97316', '#ef4444', '#6366f1'];

function AnalyticsPage() {
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const theme = useTheme();
    const [analyticsData, setAnalyticsData] = useState({ monthlySalesVsPurchases: [], topProductsByRevenue: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch data from the new backend report controller
            const response = await api.get('/reports/analytics');
            setAnalyticsData(response.data);
        } catch (err) {
            console.error("Failed to fetch analytics data", err);
             if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
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

    const dashboardLink = role === 'ADMIN' ? "/admin-dashboard" : "/dashboard";

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <CssBaseline />
            {/* SIDEBAR (Includes all relevant links) */}
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
                        SmartShelf Analytics
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
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/sales-report">
                                <ListItemIcon><BarChartIcon /></ListItemIcon>
                                <ListItemText primary="Sales Report" />
                            </ListItemButton>
                        </ListItem>
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
                            <ListItemButton component={RouterLink} to="/suppliers">
                                <ListItemIcon><PeopleIcon /></ListItemIcon>
                                <ListItemText primary="Suppliers" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={RouterLink} to="/analytics" selected>
                                <ListItemIcon><AnalyticsIcon sx={{ color: 'secondary.main' }} /></ListItemIcon>
                                <ListItemText primary="Analytics" />
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
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
                <Toolbar />
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <AnalyticsIcon fontSize="large" color="secondary" /> Operational Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Visual insights into revenue trends, purchase costs, and top-performing inventory.
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={4}>
                        {/* CHART 1: Monthly Sales vs Purchase Costs (Bar Chart) */}
                        <Grid item xs={12} lg={8}>
                            <Paper elevation={3} sx={{ p: 3, height: 400, bgcolor: 'background.paper' }}>
                                <Typography variant="h6" gutterBottom>Monthly Revenue & Cost Comparison</Typography>
                                <ResponsiveContainer width="100%" height="90%">
                                    <BarChart data={analyticsData.monthlySalesVsPurchases} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                        <XAxis dataKey="month" stroke={theme.palette.text.primary} />
                                        <YAxis stroke={theme.palette.text.primary} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                                        <Legend />
                                        <Bar dataKey="SalesRevenue" fill={CHART_COLORS[0]} name="Sales Revenue" />
                                        <Bar dataKey="PurchaseCost" fill={CHART_COLORS[2]} name="Purchase Cost" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* CHART 2: Top Selling Products (Pie Chart) */}
                        <Grid item xs={12} lg={4}>
                            <Paper elevation={3} sx={{ p: 3, height: 400, bgcolor: 'background.paper' }}>
                                <Typography variant="h6" gutterBottom>Top 5 Products by Revenue</Typography>
                                <ResponsiveContainer width="100%" height="90%">
                                    <PieChart>
                                        <Pie
                                            data={analyticsData.topProductsByRevenue}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                        >
                                            {analyticsData.topProductsByRevenue.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                        {/* Handle case where no data is available */}
                        {analyticsData.monthlySalesVsPurchases.length === 0 && analyticsData.topProductsByRevenue.length === 0 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 5 }}>
                                    No sufficient sales or purchase data available to generate analytics yet. Try recording more sales!
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}

export default AnalyticsPage;