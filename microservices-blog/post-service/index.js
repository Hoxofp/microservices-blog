require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3002;

// Winston Logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'post-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Startup validation
if (!process.env.MONGO_URI) {
    logger.error('MONGO_URI environment variable is required');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET environment variable is required');
    process.exit(1);
}

// Request Logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        logger.info('Request', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: Date.now() - start
        });
    });
    next();
});

app.use(express.json());

// Health check - Enhanced
app.get('/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    res.status(dbState === 1 ? 200 : 503).json({
        status: dbState === 1 ? 'healthy' : 'unhealthy',
        service: 'post-service',
        database: dbStates[dbState],
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);

// Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal Server Error' });
});

// MongoDB Connection with retry
const connectWithRetry = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });
        logger.info('Connected to MongoDB');
    } catch (err) {
        logger.error('MongoDB connection error, retrying in 5 seconds...', { error: err.message });
        setTimeout(connectWithRetry, 5000);
    }
};

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected, attempting reconnection...');
});

mongoose.connection.on('error', (err) => {
    logger.error('MongoDB error', { error: err.message });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Graceful shutdown initiated.`);
    try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        logger.error('Error during shutdown', { error: err.message });
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
connectWithRetry();

app.listen(PORT, () => {
    logger.info(`Post Service running on port ${PORT}`);
});

