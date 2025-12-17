const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 3000;

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const POST_SERVICE_URL = process.env.POST_SERVICE_URL || 'http://post-service:3002';

// CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API Gateway is running',
        version: '2.0.0',
        services: ['auth', 'posts', 'categories']
    });
});

// Proxy to Auth Service
app.use('/auth', proxy(AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/auth${req.url}`
}));

// Proxy to Post Service
app.use('/posts', proxy(POST_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/posts${req.url}`
}));

// Proxy to Categories (Post Service)
app.use('/categories', proxy(POST_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/categories${req.url}`
}));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
