require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Winston Logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'auth-service' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

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
        service: 'auth-service',
        database: dbStates[dbState],
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/auth', authRoutes);

// Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal Server Error' });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error', { error: err.message }));

app.listen(PORT, () => {
    logger.info(`Auth Service running on port ${PORT}`);
});
