// In src/components/SalesReportsPage.js

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar, Box, Button, Container, CssBaseline, Grid,
  Toolbar, Typography, Paper, CircularProgress, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format, subDays } from 'date-fns'; // For setting default dates

function SalesReportsPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Set default date range (e.g., last 7 days)
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());

  // Fetch data when component loads or dates change
  useEffect(() => {
    fetchSalesReport();
  }, []); // Run once on initial load

  const fetchSalesReport = async () => {
    setLoading(true);
    setError('');

    // Format dates to ISO strings (e.g., "2025-11-06T14:30:00.000Z")
    const params = new URLSearchParams();
    params.append('startDate', startDate.toISOString());
    params.append('endDate', endDate.toISOString());

    try {
      const response = await api.get('/sales/report', { params });

      // Format data for the chart
      const formattedData = response.data.map(sale => ({
        ...sale,
        // Format the date to be readable on the chart's X-axis
        saleDateFormatted: format(new Date(sale.saleDate), 'MMM d, h:mm a')
      }));
      setSales(formattedData);

    } catch (err) {
      console.error("Error fetching sales report:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      } else {
        setError("Failed to load sales report.");
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartShelf - Sales Report
          </Typography>
          {/* Navigation buttons to go back */}
          <Button color="inherit" component={RouterLink} to="/dashboard">Manager Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/admin-dashboard">Admin Dashboard</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 10, p: 3 }}>
        <Typography variant="h4" gutterBottom>Sales Report</Typography>

        {/* --- Date Filter Bar --- */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <DateTimePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DateTimePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchSalesReport}
                disabled={loading}
              >
                Run Report
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
        {error && <Typography color="error" align="center" sx={{ my: 3 }}>{error}</Typography>}

        {/* --- Sales Chart --- */}
        {!loading && !error && sales.length > 0 && (
          <Paper sx={{ p: 2, mb: 3, height: 400 }}>
            <Typography variant="h6">Sales Trend</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sales}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="saleDateFormatted" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="quantitySold" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        )}

        {/* --- Sales Data Table --- */}
        {!loading && !error && (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sale ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantity Sold</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date of Sale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow hover key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>{sale.productName}</TableCell>
                      <TableCell>{sale.quantitySold}</TableCell>
                      <TableCell>{sale.saleDateFormatted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

      </Container>
    </Box>
  );
}

export default SalesReportsPage;