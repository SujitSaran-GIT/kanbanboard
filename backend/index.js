import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet'

import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'


dotenv.config();

// Validate required environment variables
if (!process.env.GUARDIAN_CLIENT_ID || !process.env.GUARDIAN_CLIENT_KEY) {
  console.error('ERROR: Missing required environment variables');
  console.error('Please set GUARDIAN_CLIENT_ID and GUARDIAN_CLIENT_KEY in your .env file');
  process.exit(1);
}


connectDB();

const app = express();

app.use(helmet());

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Client-Id',
    'X-Client-Key'
  ],
  exposedHeaders: ['Authorization']
}));

// Logging middleware
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'kanban-api',
    version: '1.0.0',
    authService: process.env.GUARDIAN_BASE_URL || 'http://localhost:8084'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// app.use('*', (req, res) => {
//   res.status(404).json({
//     error: 'Not Found',
//     message: `Route ${req.method} ${req.originalUrl} not found`,
//     timestamp: new Date().toISOString()
//   });
// });

const PORT = process.env.PORT || 8001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Kanban API Server started on port ${PORT}`);
  console.log(`🔗 Auth Service: ${process.env.GUARDIAN_BASE_URL || 'http://localhost:8084'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

