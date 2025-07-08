
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// DB connection
const connectDB = require('./database/db');
connectDB(); // ✅ Connecting MongoDB

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ parse JSON request bodies

// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// API Routes
app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);// ✅ routes like GET /api/products
console.log('typeof productRoutes:', typeof productRoutes);
console.log('typeof authRoutes:', typeof authRoutes);


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
