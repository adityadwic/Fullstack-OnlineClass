const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./src/utils/prisma');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to PostgreSQL via Prisma
connectDB();

// CORS Configuration - Allow local and ngrok origins
app.use(cors({
  origin: [
    'http://localhost:4001', 
    'http://localhost:3000', 
    'http://192.168.100.120:4001', 
    'http://127.0.0.1:4001',
    /\.ngrok-free\.app$/,   // Allow all ngrok-free.app URLs
    /\.ngrok-free\.dev$/,   // Allow all ngrok-free.dev URLs
    /\.ngrok\.io$/,         // Allow ngrok.io URLs (paid plan)
    /\.ngrok\.app$/,        // Allow ngrok.app URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Online Learning Platform API',
    version: '1.0.0',
    status: 'Active'
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    success: true,
    message: 'Online Learning Platform API is running',
    version: '1.0.0',
    status: 'Active'
  });
});

// Routes
app.use('/api/auth', require('./src/routes/authPrisma'));
app.use('/api/courses', require('./src/routes/coursesPrisma'));
app.use('/api/progress', require('./src/routes/progressRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Online Learning Platform API`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});