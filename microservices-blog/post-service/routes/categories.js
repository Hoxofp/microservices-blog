const express = require('express');
const Category = require('../models/Category');
const Post = require('../models/Post');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

// Tüm kategorileri listele
router.get('/', async (req, res) => {
    try {
        console.log('[GET /categories] Request received');
        const categories = await Category.find()
            .sort({ postCount: -1, name: 1 });
        console.log('[GET /categories] Found:', categories.length, 'categories');
        res.json(categories);
    } catch (error) {
        console.error('[GET /categories] Error:', error.message);
        res.status(500).json({ message: 'Kategoriler yüklenirken hata', error: error.message });
    }
});

// Popüler kategoriler (top 10)
router.get('/popular', async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ postCount: -1 })
            .limit(10);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Popüler kategoriler yüklenirken hata', error: error.message });
    }
});

// Tek kategori getir (slug ile)
router.get('/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Kategori yüklenirken hata', error: error.message });
    }
});

// Kategorideki postları getir
router.get('/:slug/posts', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }

        const sort = req.query.sort || 'new'; // 'new', 'top', 'hot'
        let sortOption = { createdAt: -1 };

        if (sort === 'top') {
            sortOption = { voteScore: -1 };
        } else if (sort === 'hot') {
            // Hot = son 24 saatte en çok oy alan
            sortOption = { voteScore: -1, createdAt: -1 };
        }

        const posts = await Post.find({ category: category._id })
            .sort(sortOption)
            .limit(50);

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Postlar yüklenirken hata', error: error.message });
    }
});

// Yeni kategori oluştur (auth required)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { name, description, icon, color } = req.body;

        if (!name || name.length < 2) {
            return res.status(400).json({ message: 'Kategori adı en az 2 karakter olmalı' });
        }

        const existingCategory = await Category.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingCategory) {
            return res.status(400).json({ message: 'Bu isimde bir kategori zaten var' });
        }

        const newCategory = new Category({
            name,
            description: description || '',
            icon: icon || '📁',
            color: color || '#6366F1',
            createdBy: req.userData.userId
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Kategori oluşturulurken hata', error: error.message });
    }
});

module.exports = router;
