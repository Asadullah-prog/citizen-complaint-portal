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

// Configured allowed origins (Production Vercel domain, FRONTEND_URL env, and local dev)
const allowedOrigins = [
  'https://citizen-complaint-portal-ten.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Server-to-server, curl, Postman, health checks
  if (allowedOrigins.includes(origin)) return true;
  if (/^https:\/\/citizen-complaint-portal.*\.vercel\.app$/.test(origin)) return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
  exposedHeaders: ['Content-Disposition', 'Content-Type'],
  optionsSuccessStatus: 204,
  credentials: false, // JWT in Authorization header, no cookie credentials
};

// Register CORS middleware first before all routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
