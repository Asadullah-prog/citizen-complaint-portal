const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citizen_complaints';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB at "${mongoUri}": ${error.message}`);
    
    // Try fallback in-memory database if mongodb-memory-server is installed
    try {
      console.log('[Database] Attempting to launch embedded in-memory MongoDB for local testing...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const fallbackUri = mongod.getUri();
      const conn = await mongoose.connect(fallbackUri);
      isConnected = true;
      console.log(`[Database] Connected to fallback In-Memory MongoDB at: ${fallbackUri}`);
    } catch (fallbackError) {
      console.error('[Database] MongoDB connection failed completely. Ensure MongoDB is running or MONGODB_URI is set.');
      console.error(fallbackError.message);
      throw error;
    }
  }
};

module.exports = connectDB;
