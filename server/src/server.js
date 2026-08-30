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

// Universal CORS configuration (Allows Vercel, local dev, preview branches, and custom domains)
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Expose-Headers', 'Content-Disposition, Content-Type');
  
  // Respond immediately to OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  exposedHeaders: ['Content-Disposition', 'Content-Type'],
}));
app.options('*', (req, res) => res.status(204).end());

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
