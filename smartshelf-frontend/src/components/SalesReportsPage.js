import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

// --- Export Libraries ---
import * as XLSX from 'xlsx';
// NOTE: jspdf libraries are removed as they are no longer needed
// --- End Export Libraries ---


// --- MUI IMPORTS (Cleaned) ---
import {
    Box, CssBaseline, Drawer, Toolbar, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, Divider, Typography, Paper, CircularProgress,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid,
    Button, useTheme,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// --- ICONS (Cleaned) ---
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
// Removed unused: PictureAsPdfIcon
import TableViewIcon from '@mui/icons-material/TableView'; // Excel Icon
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AiIcon from '@mui/icons-material/AutoAwesome';
import ReorderIcon from '@mui/icons-material/Reorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';


// Recharts Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const drawerWidth = 240;

function SalesReportsPage() {
    const { themeMode, toggleTheme } = useContext(ThemeContext);
    const theme = useTheme();
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    // --- State ---
    const [salesData, setSalesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());

    // --- Memoized Data for Chart/Table ---
    const chartData = salesData.reduce((acc, sale) => {
        // Data Check: Ensure price is treated as a number
        const price = typeof sale.price === 'number' ? sale.price : 0;

        const date = new Date(sale.saleDate).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { date: date, totalRevenue: 0 };
        }
        acc[date].totalRevenue += sale.quantitySold * price;
        return acc;
    }, {});
    const revenueByDate = Object.values(chartData).sort((a, b) => new Date(a.date) - new Date(b.date));

    // --- Handlers ---
    const fetchSalesReport = useCallback(async (start, end) => {
        setLoading(true);
        setError('');

        // Format dates as YYYY-MM-DD
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        try {
            const response = await api.get('/sales/report', {
                params: {
                    startDate: startStr,
                    endDate: endStr,
                }
            });
            setSalesData(response.data);

        } catch (err) {
            console.error("Error fetching sales report:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                navigate('/login');
            } else {
                setError("Failed to load sales report. (Check server logs)");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchSalesReport(startDate, endDate);
    }, [fetchSalesReport, startDate, endDate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    // --- Export Logic ---

    const prepareExportData = () => {
        return salesData.map(sale => {
            const price = typeof sale.price === 'number' ? sale.price : 0;
            const total = sale.quantitySold * price;
            return {
                'Product Name': sale.productName,
                'Quantity Sold': sale.quantitySold,
                'Sale Date': new Date(sale.saleDate).toLocaleDateString('en-US'),
                'Unit Price': `$${price.toFixed(2)}`,
                'Total Revenue': `$${total.toFixed(2)}`,
            };
        });
    };

    const exportToExcel = () => {
        const dataToExport = prepareExportData();
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
        XLSX.writeFile(wb, `Sales_Report_${new Date().toLocaleDateString('en-US').replace(/\//g, '-')}.xlsx`);
    };

    // --- End Export Logic ---

    const dashboardLink = role === 'ADMIN' ? "/admin-dashboard" : "/dashboard";
    const totalRevenue = salesData.reduce((sum, sale) => {
        const price = typeof sale.price === 'number' ? sale.price : 0;
        return sum + sale.quantitySold * price;
    }, 0);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
                <CssBaseline />

                {/* --- SIDEBAR --- */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper' },
                    }}
                >
                    <Toolbar sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            Sales Hub
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
                                <ListItemButton selected>
                                    <ListItemIcon><BarChartIcon color="primary" /></ListItemIcon>
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
                                    <ListItemIcon><ReorderIcon /></ListItemIcon>
                                    <ListItemText primary="Restock Requests" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/suppliers">
                                    <ListItemIcon><LocalShippingIcon /></ListItemIcon>
                                    <ListItemText primary="Suppliers" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={RouterLink} to="/analytics">
                                    <ListItemIcon><AnalyticsIcon /></ListItemIcon>
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

                {/* --- MAIN CONTENT AREA --- */}
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Sales Reports & Analysis
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        View transactions and revenue trends across specified time periods.
                    </Typography>

                    {/* --- DATE FILTER BAR (Layout is good) --- */}
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={4}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={setStartDate}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={setEndDate}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => fetchSalesReport(startDate, endDate)}
                                    startIcon={<BarChartIcon />}
                                    sx={{ py: 1.5 }}
                                    fullWidth
                                >
                                    Generate Report
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {error && (
                        <Typography color="error" align="center" sx={{ my: 3 }}>
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && (
                        <Grid container spacing={4}>

                            {/* --- REVENUE TREND (BIG BOX, xs=12) --- */}
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ p: 3, height: 350, bgcolor: 'background.paper' }}>
                                    <Typography variant="h6" gutterBottom>Revenue Trend</Typography>
                                    <ResponsiveContainer width="100%" height="80%">
                                        <LineChart data={revenueByDate}>
                                            <CartesianGrid strokeDashArray="3 3" stroke={theme.palette.divider} />
                                            <XAxis dataKey="date" stroke={theme.palette.text.primary} />
                                            <YAxis stroke={theme.palette.text.primary} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                                            <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}` }} />
                                            <Legend />
                                            <Line type="monotone" dataKey="totalRevenue" name="Total Sales Revenue" stroke={theme.palette.primary.main} strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            {/* --- TOTAL REVENUE SUMMARY & EXPORT (SMALL BOX, xs=12) --- */}
                            <Grid item xs={12}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        bgcolor: 'success.main',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        color: 'white',
                                        minHeight: 100,
                                    }}
                                >
                                    {/* Summary Text */}
                                    <Box>
                                        <Typography variant="h6">Total Revenue in Period:</Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            {totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </Typography>
                                    </Box>

                                    {/* Export Buttons (Aligned neatly at the bottom) */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        {/* REMOVED PDF EXPORT BUTTON */}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ color: 'white', borderColor: 'white' }}
                                            onClick={exportToExcel}
                                            startIcon={<TableViewIcon />}
                                            disabled={salesData.length === 0}
                                        >
                                            Export Excel
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Sales Table (Full width below the summary/exports) */}
                            <Grid item xs={12}>
                                <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, bgcolor: 'background.paper' }}>
                                    <TableContainer>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
                                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Product</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Quantity</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Price</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>Date</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }} align="right">Total</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {salesData.map((sale) => (
                                                    <TableRow hover key={sale.id}>
                                                        <TableCell sx={{ fontWeight: 'medium' }}>{sale.productName}</TableCell>
                                                        <TableCell>{sale.quantitySold}</TableCell>
                                                        <TableCell>${typeof sale.price === 'number' ? sale.price.toFixed(2) : '0.00'}</TableCell>
                                                        <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                                                        <TableCell align="right">${(sale.quantitySold * (typeof sale.price === 'number' ? sale.price : 0)).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Box>
        </LocalizationProvider>
    );
}

export default SalesReportsPage;