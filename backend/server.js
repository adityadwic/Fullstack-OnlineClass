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

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:4001', 
  'http://localhost:3000', 
  'http://192.168.100.120:4001', 
  'http://127.0.0.1:4001',
  process.env.FRONTEND_URL, // Production frontend URL from environment
];

const allowedOriginsRegex = [
  /\.ngrok-free\.app$/,   // Ngrok URLs
  /\.ngrok-free\.dev$/,
  /\.ngrok\.io$/,
  /\.ngrok\.app$/,
  /\.vercel\.app$/,       // Vercel production & preview deployments
  /\.railway\.app$/,      // Railway deployments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Check if origin matches any regex pattern
    const isAllowedByRegex = allowedOriginsRegex.some(regex => regex.test(origin));
    if (isAllowedByRegex) {
      return callback(null, true);
    }

    // Origin not allowed
    callback(new Error('Not allowed by CORS'));
  },
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