import React, { useState, useEffect, useContext, useCallback } from 'react';
 import api from '../api/api';
 import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
 import { ThemeContext } from '../ThemeContext';

 // --- MUI IMPORTS (General Components) ---
 import {
   Box, Button, CssBaseline, Modal, Table, TableBody,
   TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar,
   Typography, Paper, CircularProgress, FormControl, InputLabel, Select,
   MenuItem, Grid,
   // --- LAYOUT & ALERT COMPONENTS ---
   Drawer,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Divider,
   IconButton,
   Badge,
   Chip,
 } from '@mui/material';
 // --- ICON IMPORTS (ALL FROM @mui/icons-material) ---
 // The package name is implicitly correct when using the syntax below:
 import DashboardIcon from '@mui/icons-material/Dashboard';
 import BarChartIcon from '@mui/icons-material/BarChart';
 import AiIcon from '@mui/icons-material/AutoAwesome';
 import ReorderIcon from '@mui/icons-material/Reorder';
 import LogoutIcon from '@mui/icons-material/Logout';
 import InventoryIcon from '@mui/icons-material/Inventory';
 import WarningIcon from '@mui/icons-material/Warning';
 import ErrorIcon from '@mui/icons-material/Error';
 import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
 import FilterAltIcon from '@mui/icons-material/FilterAlt'; // <<< FIXED: Now explicitly imported
 import ClearIcon from '@mui/icons-material/Clear'; // <<< FIXED: Now explicitly imported
 import Brightness4Icon from '@mui/icons-material/Brightness4';
 import Brightness7Icon from '@mui/icons-material/Brightness7'; // <<< FIXED: Imported from icons-material
 import NotificationsIcon from '@mui/icons-material/Notifications';
 import LocalShippingIcon from '@mui/icons-material/LocalShipping';
 import AnalyticsIcon from '@mui/icons-material/Analytics';
 // --- END NEW IMPORTS ---

 const drawerWidth = 240; // Sidebar width

 // --- Modal Style (Unchanged) ---
 const modalStyle = {
   position: 'absolute', top: '50%', left: '50%',
   transform: 'translate(-50%, -50%)', width: 400,
   bgcolor: 'background.paper', border: '2px solid #000',
   boxShadow: 24, p: 4, display: 'flex', flexDirection: 'column', gap: 2,
 };

 // --- Stat Card Component (Unchanged) ---
 function StatCard({ title, value, icon, color = 'text.primary' }) {
   return (
     <Paper
       elevation={3}
       sx={{
         p: 3,
         borderRadius: 3,
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         height: '100%',
         backgroundColor: 'background.paper',
       }}
     >
       <Box>
         <Typography variant="h6" color="text.secondary" gutterBottom>
           {title}
         </Typography>
         <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
           {value}
         </Typography>
       </Box>
       <Box sx={{ color: color }}>
         {icon}
       </Box>
     </Paper>
   );
 }

 function DashboardPage() {
   // --- State Variables ---
   const { themeMode, toggleTheme } = useContext(ThemeContext);
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();

   // --- State for Stats & Alerts (Unchanged) ---
   const [stats, setStats] = useState({
     totalProducts: 0,
     lowStockItems: 0,
     criticalStock: 0,
     inventoryValue: 0,
   });

   // --- Alert Modal State (Unchanged) ---
   const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
   const [criticalStockItems, setCriticalStockItems] = useState([]);


   // --- Modal States (Unchanged) ---
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [newProduct, setNewProduct] = useState({
     productName: '', category: '', quantity: 0, price: 0.0, supplier: '', imageUrl: ''
   });
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [editingProduct, setEditingProduct] = useState(null);
   const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
   const [newSale, setNewSale] = useState({ productId: '', quantitySold: 0 });
   const [filters, setFilters] = useState({
     category: '', supplier: '', maxStock: '',
   });

   // --- Memoized fetchProducts using useCallback (Fixes hook dependency warning) ---
   const fetchProducts = useCallback(async (currentFilters = filters) => {
     setLoading(true);
     setError('');

     const params = new URLSearchParams();
     if (currentFilters.category) params.append('category', currentFilters.category);
     if (currentFilters.supplier) params.append('supplier', currentFilters.supplier);
     if (currentFilters.maxStock) params.append('maxStock', currentFilters.maxStock);

     try {
       const response = await api.get('/products', { params });
       const productsData = response.data;
       setProducts(productsData);

       // --- CALCULATE STATS & CRITICAL ALERT COUNT ---
       const LOW_STOCK_THRESHOLD = 20;
       const CRITICAL_STOCK_THRESHOLD = 5;

       const criticalItems = productsData.filter(p => p.quantity < CRITICAL_STOCK_THRESHOLD);

       const total = productsData.length;
       const lowStock = productsData.filter(p => p.quantity < LOW_STOCK_THRESHOLD && p.quantity >= CRITICAL_STOCK_THRESHOLD).length;
       const invValue = productsData.reduce((sum, p) => sum + (p.price * p.quantity), 0);

       setStats({
         totalProducts: total,
         lowStockItems: lowStock,
         criticalStock: criticalItems.length,
         inventoryValue: invValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
       });
       setCriticalStockItems(criticalItems);
       // --- END STATS CALCULATION ---

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
   }, [filters, navigate]); // <<< filters and navigate are dependencies

   // --- Initial Load/URL Filter Application (Fixes hook dependency warning) ---
   useEffect(() => {
     const supplierFilter = searchParams.get('supplier');

     if (supplierFilter) {
       const initialFilters = { ...filters, supplier: supplierFilter };

       if (filters.supplier !== supplierFilter) {
         setFilters(initialFilters);
       }
       fetchProducts(initialFilters);
     } else {
       fetchProducts(filters);
     }
   }, [searchParams, fetchProducts]); // <<< dependencies added


   // --- Alert Modal Handlers (Unchanged) ---
   const handleOpenAlertModal = () => setIsAlertModalOpen(true);
   const handleCloseAlertModal = () => setIsAlertModalOpen(false);


   // --- All handler functions (handleLogout, create, delete, edit, sale, filter) are updated to remove unused variables ---
   const handleLogout = () => {
     localStorage.removeItem('token');
     localStorage.removeItem('role');
     navigate('/login');
   };

   // --- Product "Create" Functions (Unchanged) ---
   const handleOpenCreateModal = () => setIsCreateModalOpen(true);
   const handleCloseCreateModal = () => {
     setIsCreateModalOpen(false);
     setNewProduct({ productName: '', category: '', quantity: 0, price: 0.0, supplier: '', imageUrl: '' });
   };
   const handleCreateFormChange = (e) => {
     const { name, value } = e.target;
     setNewProduct((prev) => ({ ...prev, [name]: value }));
   };
   const handleCreateSubmit = async (e) => {
     e.preventDefault();
     try {
       await api.post('/products', newProduct);
       handleCloseCreateModal();
       fetchProducts(filters);
     } catch (err) {
       console.error("Error creating product:", err);
       setError("Failed to create product.");
     }
   };

   // --- Product "Delete" Function (Unchanged) ---
   const handleDelete = async (id) => {
     if (window.confirm("Are you sure you want to delete this product?")) {
       try {
         await api.delete(`/products/${id}`);
         fetchProducts(filters);
       } catch (err) {
         console.error("Error deleting product:", err);
         setError("Failed to delete product.");
       }
     }
   };

   // --- Product "Edit" Functions (Unchanged) ---
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
       fetchProducts(filters);
     } catch (err) {
       console.error("Error updating product:", err);
       setError("Failed to update product.");
     }
   };

   // --- "Record Sale" Functions (Unchanged) ---
   const handleOpenSaleModal = () => setIsSaleModalOpen(true);
   const handleCloseSaleModal = () => {
     setIsSaleModalOpen(false);
     setNewSale({ productId: '', quantitySold: 0 });
   };
   const handleSaleFormChange = (e) => {
     const { name, value } = e.target;
     setNewSale((prev) => ({ ...prev, [name]: value }));
   };
   const handleSaleSubmit = async (e) => {
     e.preventDefault();
     try {
       await api.post('/sales', newSale);
       handleCloseSaleModal();
       fetchProducts(filters);
     } catch (err) {
         console.error("Error recording sale:", err);
         if (err.response && err.response.data) {
           setError(err.response.data);
         } else {
           setError("Failed to record sale.");
         }
     }
   };

   // --- Filter Handlers (Unchanged) ---
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
   // --- END HANDLERS ---


   // --- RENDER LOGIC ---
   return (
     <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
       <CssBaseline />

       {/* --- SIDEBAR --- */}
       <Drawer
         variant="permanent"
         sx={{
           width: drawerWidth,
           flexShrink: 0,
           [`& .MuiDrawer-paper`]: {
             width: drawerWidth,
             boxSizing: 'border-box',
             borderRight: '0px',
             bgcolor: 'background.paper'
           },
         }}
       >
         <Toolbar sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
           <img src="/logo192.png" alt="logo" style={{ width: 32, height: 32, marginRight: 12 }} />
           <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
             SmartShelf
           </Typography>
         </Toolbar>
         <Box sx={{ overflow: 'auto', p: 1 }}>
           <Typography variant="caption" sx={{ pl: 2, color: 'text.secondary' }}>NAVIGATION</Typography>
           <List>
              <ListItem disablePadding>
               <ListItemButton component={RouterLink} to="/dashboard" selected={!searchParams.get('supplier')}>
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
                     <ListItemIcon><ReorderIcon /></ListItemIcon>
                     <ListItemText primary="Restock Requests" />
                 </ListItemButton>
              </ListItem>
              {/* --- Suppliers Link --- */}
              <ListItem disablePadding>
                 <ListItemButton component={RouterLink} to="/suppliers">
                     <ListItemIcon><LocalShippingIcon /></ListItemIcon>
                     <ListItemText primary="Suppliers" />
                 </ListItemButton>
              </ListItem>
              {/* --- Analytics Link (Module 7) --- */}
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
       {/* --- END SIDEBAR --- */}

       {/* --- NEW MAIN CONTENT AREA --- */}
       <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
         {/* Header Bar */}
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
           <Box>
             <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Inventory Dashboard</Typography>
             <Typography variant="body1" color="text.secondary">Welcome! Manage sales, products, and see insights at a glance.</Typography>
           </Box>
           <Box sx={{ display: 'flex', alignItems: 'center' }}>

             {/* --- CRITICAL FIX: Notification Bell Icon (Module 6) --- */}
             <IconButton
                 color="inherit"
                 sx={{ mr: 2, color: stats.criticalStock > 0 ? 'error.main' : 'text.secondary' }}
                 onClick={handleOpenAlertModal}
             >
               <Badge badgeContent={stats.criticalStock} color="error">
                 <NotificationsIcon />
               </Badge>
             </IconButton>
             {/* --- END Notification Bell --- */}

             <IconButton sx={{ mr: 1 }} onClick={toggleTheme} color="inherit">
               {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
             </IconButton>

             <Button
               variant="outlined"
               color="primary"
               component={RouterLink}
               to="/sales-report"
               sx={{ mr: 2 }}
             >
               View Sales Report
             </Button>
             <Button variant="contained" color="success" onClick={handleOpenSaleModal} sx={{ mr: 2 }}>
               Record Sale
             </Button>
             <Button
               variant="contained"
               color="primary"
               onClick={handleOpenCreateModal}
               sx={{ boxShadow: '0 4px 12px 0 rgba(79,70,229,0.3)' }}
             >
               + Add New Product
             </Button>
           </Box>
         </Box>

         {/* --- NEW STATS CARDS (FIXED LAYOUT) --- */}
         <Grid container spacing={3} sx={{ mb: 3 }}>
         <Grid item xs={12} sm={6} md={3}>
             <StatCard
               title="Total Products"
               value={stats.totalProducts}
               icon={<InventoryIcon sx={{ fontSize: 40 }} />}
               color="#4f46e5" // Theme primary
             />
           </Grid>
           <Grid item xs={12} sm={6} md={3}>
             <StatCard
               title="Low Stock Items"
               value={stats.lowStockItems}
               icon={<WarningIcon sx={{ fontSize: 40 }} />}
               color="#ffc107"
             />
           </Grid>
           <Grid item xs={12} sm={6} md={3}>
             <StatCard
               title="Critical Stock"
               value={stats.criticalStock}
               icon={<ErrorIcon sx={{ fontSize: 40 }} />}
               color="#dc3545"
             />
           </Grid>
           <Grid item xs={12} sm={6} md={3}>
             <StatCard
               title="Inventory Value"
               value={stats.inventoryValue}
               icon={<AttachMoneyIcon sx={{ fontSize: 40 }} />}
               color="#28a745"
             />
           </Grid>
         </Grid>

         {/* --- FILTER BAR (Unchanged) --- */}
         <Paper sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
           <Grid container spacing={2} alignItems="center">
             {/* --- Filter Inputs --- */}
             <Grid item xs={12} sm={3}>
               <TextField fullWidth label="Filter by Category" name="category" value={filters.category} onChange={handleFilterChange} variant="outlined" size="small" />
             </Grid>
             <Grid item xs={12} sm={3}>
               <TextField fullWidth label="Filter by Supplier" name="supplier" value={filters.supplier} onChange={handleFilterChange} variant="outlined" size="small" />
             </Grid>
             <Grid item xs={12} sm={3}>
               <TextField fullWidth label="Show Stock <=" name="maxStock" type="number" value={filters.maxStock} onChange={handleFilterChange} variant="outlined" size="small" />
             </Grid>
             <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 1 }}>
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

         {/* --- Product Table (Unchanged) --- */}
         {!loading && !error && (
           <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, bgcolor: 'background.paper' }}>
             <TableContainer>
               <Table stickyHeader>
                 <TableHead>
                   <TableRow>
                     <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                     <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
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
                       <TableCell>
                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
                           <img
                             src={product.imageUrl || 'https://via.placeholder.com/40'}
                             alt={product.productName}
                             style={{ width: 40, height: 40, marginRight: 12, borderRadius: 4 }}
                           />
                           {product.productName}
                         </Box>
                       </TableCell>
                       <TableCell>{product.category}</TableCell>
                       <TableCell sx={{ color: product.quantity < 20 ? (themeMode === 'dark' ? '#f77' : 'red') : 'inherit', fontWeight: product.quantity < 20 ? 'bold' : 'normal' }}>
                         {product.quantity}
                       </TableCell>
                       <TableCell>${product.price.toFixed(2)}</TableCell>
                       <TableCell>{product.supplier}</TableCell>
                       <TableCell>
                         <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleOpenEditModal(product)}>
                           Edit
                         </Button>
                         <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(product.id)}>
                           Delete
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </TableContainer>
           </Paper>
         )}

         {/* --- All Modals (Unchanged) --- */}
         <Modal open={isCreateModalOpen} onClose={handleCloseCreateModal}>
           <Box component="form" onSubmit={handleCreateSubmit} sx={modalStyle}>
             <Typography variant="h6">Add New Product</Typography>
             <TextField name="productName" label="Product Name" value={newProduct.productName} onChange={handleCreateFormChange} required fullWidth />
             <TextField name="category" label="Category" value={newProduct.category} onChange={handleCreateFormChange} fullWidth />
             <TextField name="quantity" label="Quantity" type="number" value={newProduct.quantity} onChange={handleCreateFormChange} required fullWidth />
             <TextField name="price" label="Price" type="number" inputProps={{ step: "0.01" }} value={newProduct.price} onChange={handleCreateFormChange} required fullWidth />
             <TextField name="supplier" label="Supplier" value={newProduct.supplier} onChange={handleCreateFormChange} fullWidth />
             <TextField name="imageUrl" label="Image URL" value={newProduct.imageUrl} onChange={handleCreateFormChange} fullWidth />
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
               <Button variant="outlined" onClick={handleCloseCreateModal}>Cancel</Button>
               <Button variant="contained" type="submit">Create</Button>
             </Box>
           </Box>
         </Modal>

         <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
           <Box component="form" onSubmit={handleUpdateSubmit} sx={modalStyle}>
             <Typography variant="h6">Edit Product (ID: {editingProduct?.id})</Typography>
             <TextField name="productName" label="Product Name" value={editingProduct?.productName || ''} onChange={handleEditFormChange} required fullWidth />
             <TextField name="category" label="Category" value={editingProduct?.category || ''} onChange={handleEditFormChange} fullWidth />
             <TextField name="quantity" label="Quantity" type="number" value={editingProduct?.quantity || 0} onChange={handleEditFormChange} required fullWidth />
             <TextField name="price" label="Price" type="number" inputProps={{ step: "0.01" }} value={editingProduct?.price || 0.0} onChange={handleEditFormChange} required fullWidth />
             <TextField name="supplier" label="Supplier" value={editingProduct?.supplier || ''} onChange={handleEditFormChange} fullWidth />
             <TextField name="imageUrl" label="Image URL" value={editingProduct?.imageUrl || ''} onChange={handleEditFormChange} fullWidth />
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
               <Button variant="outlined" onClick={handleCloseEditModal}>Cancel</Button>
               <Button variant="contained" type="submit">Save Changes</Button>
             </Box>
           </Box>
         </Modal>

         <Modal open={isSaleModalOpen} onClose={handleCloseSaleModal}>
           <Box component="form" onSubmit={handleSaleSubmit} sx={modalStyle}>
             <Typography variant="h6">Record New Sale</Typography>
             <FormControl fullWidth required>
               <InputLabel id="product-select-label">Product</InputLabel>
               <Select
                 labelId="product-select-label"
                 id="productId"
                 name="productId"
                 value={newSale.productId}
                 label="Product"
                 onChange={handleSaleFormChange}
               >
                 {products.map((product) => (
                   <MenuItem key={product.id} value={product.id}>
                     {product.productName} (In Stock: {product.quantity})
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
             <TextField
               name="quantitySold"
               label="Quantity Sold"
               type="number"
               value={newSale.quantitySold}
               onChange={handleSaleFormChange}
               required
               fullWidth
             />
             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
               <Button variant="outlined" onClick={handleCloseSaleModal}>Cancel</Button>
               <Button variant="contained" color="success" type="submit">
                 Submit Sale
               </Button>
             </Box>
           </Box>
         </Modal>

         {/* --- NEW: Alert Modal (Module 6) --- */}
         <Modal open={isAlertModalOpen} onClose={handleCloseAlertModal}>
             <Box sx={modalStyle}>
                 <Typography variant="h6" color="error">Critical Stock Alert ({stats.criticalStock} Items)</Typography>
                 <Divider />
                 {criticalStockItems.length > 0 ? (
                     <List dense>
                         {criticalStockItems.map((item) => (
                             <ListItem key={item.id} secondaryAction={
                                 <Chip label={item.quantity} color="error" size="small" />
                             }>
                                 <ListItemIcon><ErrorIcon color="error" /></ListItemIcon>
                                 <ListItemText primary={item.productName} secondary={`Stock: ${item.quantity}`} />
                             </ListItem>
                         ))}
                     </List>
                 ) : (
                     <Typography color="text.secondary">No items are currently at critical stock levels (below 5).</Typography>
                 )}
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                     <Button variant="contained" onClick={handleCloseAlertModal}>Close</Button>
                 </Box>
             </Box>
         </Modal>
         {/* --- END NEW MODAL --- */}

       </Box>
     </Box>
   );
 }

 export default DashboardPage;