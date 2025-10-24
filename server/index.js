const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const farmerRoutes = require('./routes/farmers');
const creditRoutes = require('./routes/credit');
const ussdRoutes = require('./routes/ussd');
const climateRoutes = require('./routes/climate');
const fspRoutes = require('./routes/fsp');
const analyticsRoutes = require('./routes/analytics');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/fsp', fspRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'AgriRisk Intelligence Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ARIP Server running on port ${PORT}`);
  console.log(`📱 USSD endpoint: http://localhost:${PORT}/api/ussd`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}/api`);
});

module.exports = app;
