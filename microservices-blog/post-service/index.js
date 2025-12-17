require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'post-service' });
});

// Routes
app.use('/posts', postRoutes);
app.use('/categories', categoryRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Post Service connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Post Service running on port ${PORT}`);
});
