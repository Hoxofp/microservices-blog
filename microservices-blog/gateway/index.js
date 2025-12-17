const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const rateLimit = require('express-rate-limit');
const CircuitBreaker = require('opossum');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://post-service:3002';

// ==================== PRODUCTION FEATURES ====================

// 1. Winston Logger - Structured JSON Logging
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'gateway' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// 2. Request ID Middleware - Distributed Tracing
app.use((req, res, next) => {
    req.requestId = req.headers['x-request-id'] || uuidv4();
    res.setHeader('X-Request-ID', req.requestId);
    next();
});

// 3. Request Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        logger.info('Request completed', {
            requestId: req.requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: Date.now() - start
        });
    });
    next();
});

// 4. Rate Limiting - DDoS Protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests',
        message: 'Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// 5. CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

app.use(express.json());

// 6. Circuit Breaker Configuration
const circuitBreakerOptions = {
    timeout: 10000, // 10 seconds
    errorThresholdPercentage: 50,
    resetTimeout: 30000 // 30 seconds
};

// Helper function to create proxy with circuit breaker
function createProxyWithCircuitBreaker(serviceUrl, pathResolver) {
    const proxyFunc = (req, res) => {
        return new Promise((resolve, reject) => {
            proxy(serviceUrl, {
                proxyReqPathResolver: pathResolver,
                proxyErrorHandler: (err, res, next) => {
                    logger.error('Proxy error', { error: err.message, service: serviceUrl });
                    reject(err);
                }
            })(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    };

    const breaker = new CircuitBreaker(proxyFunc, circuitBreakerOptions);

    breaker.on('open', () => logger.warn('Circuit breaker OPEN', { service: serviceUrl }));
    breaker.on('close', () => logger.info('Circuit breaker CLOSED', { service: serviceUrl }));
    breaker.on('halfOpen', () => logger.info('Circuit breaker HALF-OPEN', { service: serviceUrl }));

    return breaker;
}

// ==================== API VERSIONING ====================
// All routes are now prefixed with /api/v1/
// Legacy routes (without /api/v1) are still supported for backward compatibility

// 7. Enhanced Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API Gateway is running',
        version: '2.0.0',
        services: ['auth', 'posts', 'categories'],
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

app.get('/health', async (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        services: {
            auth: AUTH_SERVICE_URL,
            post: POST_SERVICE_URL
        }
    });
});

// ==================== PROXY ROUTES ====================

// Auth Service proxy with simple fallback (circuit breaker on fetch approach)
const authProxyOptions = {
    proxyReqPathResolver: (req) => `/auth${req.url}`,
    proxyErrorHandler: (err, res, next) => {
        logger.error('Auth service error', { error: err.message });
        res.status(503).json({ error: 'Auth service unavailable', message: 'Please try again later' });
    }
};

const postProxyOptions = {
    proxyReqPathResolver: (req) => `/posts${req.url}`,
    proxyErrorHandler: (err, res, next) => {
        logger.error('Post service error', { error: err.message });
        res.status(503).json({ error: 'Post service unavailable', message: 'Please try again later' });
    }
};

const categoryProxyOptions = {
    proxyReqPathResolver: (req) => `/categories${req.url}`,
    proxyErrorHandler: (err, res, next) => {
        logger.error('Category service error', { error: err.message });
        res.status(503).json({ error: 'Category service unavailable', message: 'Please try again later' });
    }
};

// API v1 routes (recommended)
app.use('/api/v1/auth', proxy(AUTH_SERVICE_URL, authProxyOptions));
app.use('/api/v1/posts', proxy(POST_SERVICE_URL, postProxyOptions));
app.use('/api/v1/categories', proxy(POST_SERVICE_URL, categoryProxyOptions));

// Legacy routes (backward compatibility)
app.use('/auth', proxy(AUTH_SERVICE_URL, authProxyOptions));
app.use('/posts', proxy(POST_SERVICE_URL, postProxyOptions));
app.use('/categories', proxy(POST_SERVICE_URL, categoryProxyOptions));

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        requestId: req.requestId
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', {
        error: err.message,
        stack: err.stack,
        requestId: req.requestId
    });
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong',
        requestId: req.requestId
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    logger.info(`API Gateway running on port ${PORT}`, {
        authService: AUTH_SERVICE_URL,
        postService: POST_SERVICE_URL
    });
});
