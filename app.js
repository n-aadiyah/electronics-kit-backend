const path = require('path');
console.log("📂 Current working directory:", process.cwd());

// ✅ Load environment variables using absolute path
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ DB connection
const connectDB = require('./database/db');
connectDB();

// ✅ Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React frontend origin
  credentials: true
}));
app.use(express.json()); // Parse JSON request bodies

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ API Routes
app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Fallback for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: '🔍 Route not found' });
});

// ✅ Error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.message);
  res.status(500).json({ message: '❌ Internal Server Error' });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
