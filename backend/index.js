const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Security: CORS - restrict to frontend origin
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:4173',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
  try {
    console.log('⏳ Attempting to connect to Primary MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // fail fast if not reachable
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('⚠️ Primary MongoDB connection failed. Falling back to Memory Server:', err.message);
    try {
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ Connected to MongoDB Memory Server (Local Fallback for Dev)');
    } catch (memErr) {
      console.error('❌ Failed to start Memory Server fallback:', memErr);
    }
  }
}

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/review', reviewRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
