const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const aiRoutes = require('./routes/aiRoutes');
const User = require('./models/User');
const seedData = require('./seed');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Fully permissive to prevent any cloud preflight block
app.use(
  cors({
    origin: true, // Automatically reflects the request origin (Vercel, localhost, etc.)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.options('*', cors()); // Enable preflight for all routes

// Express Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Citizen Complaint & Municipal Management Portal API is active.',
    health: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Citizen Complaint Portal API',
    time: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start HTTP Server immediately so Railway/Render never reports crashed container
const host = '0.0.0.0';
app.listen(PORT, host, () => {
  console.log(`====================================================`);
  console.log(`  Citizen Complaint Portal Backend Running!`);
  console.log(`  Port: http://${host}:${PORT}`);
  console.log(`  Health Check: http://${host}:${PORT}/api/health`);
  console.log(`====================================================`);

  // Connect to Database asynchronously
  connectDB()
    .then(async () => {
      try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log('[Startup] No users found. Auto-seeding initial database...');
          await seedData();
        }
      } catch (seedErr) {
        console.warn('[Startup] Auto-seed check notice:', seedErr.message);
      }
    })
    .catch((dbErr) => {
      console.error('[Startup] Initial DB connection issue:', dbErr.message);
    });
});

module.exports = app;
