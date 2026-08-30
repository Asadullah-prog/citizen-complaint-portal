const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const rawUri = process.env.MONGODB_URI;

  if (!rawUri) {
    console.warn('[Database] ⚠️ MONGODB_URI environment variable is not set!');
    console.warn('[Database] Falling back to default localhost or in-memory MongoDB.');
  }

  const mongoUri = rawUri || 'mongodb://127.0.0.1:27017/citizen_complaints';

  // Sanitize URI for safe logging
  const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`[Database] Connecting to MongoDB: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    isConnected = true;
    console.log(`[Database] ✅ MongoDB connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database] ❌ Failed to connect to MongoDB (${maskedUri}): ${error.message}`);
    
    // Only attempt in-memory server in development/test or if installed
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Attempting fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        const conn = await mongoose.connect(fallbackUri);
        isConnected = true;
        console.log(`[Database] ✅ Connected to fallback In-Memory MongoDB at: ${fallbackUri}`);
        return;
      } catch (fallbackError) {
        console.error('[Database] In-memory fallback also failed.');
      }
    }

    console.error('\n=== MONGODB TROUBLESHOOTING ===');
    console.error('1. Ensure MONGODB_URI is set in your Railway / Render Variables.');
    console.error('2. Ensure your MongoDB Atlas user password does not contain unescaped special characters (e.g., encode "@" as "%40").');
    console.error('3. Ensure Network Access in MongoDB Atlas allows IP: 0.0.0.0/0 (Allow Access from Anywhere).\n');
    
    throw error;
  }
};

module.exports = connectDB;
