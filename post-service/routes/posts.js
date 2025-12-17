const express = require('express');
const Post = require('../models/Post');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

// List all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ created_at: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

// Create a new post (Protected)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;

        const newPost = new Post({
            title,
            content
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

module.exports = router;
