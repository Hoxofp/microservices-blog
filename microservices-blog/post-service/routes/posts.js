const express = require('express');
const Post = require('../models/Post');
const Category = require('../models/Category');
const isAuthenticated = require('../middleware/auth');

const router = express.Router();

// Tüm postları listele (pagination ve sorting ile)
router.get('/', async (req, res) => {
    try {
        const sort = req.query.sort || 'new';
        const limit = parseInt(req.query.limit) || 50;

        let sortOption = { createdAt: -1 };
        if (sort === 'top') sortOption = { voteScore: -1 };
        if (sort === 'hot') sortOption = { voteScore: -1, createdAt: -1 };

        const posts = await Post.find()
            .sort(sortOption)
            .limit(limit)
            .populate('category', 'name slug icon color');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Postlar yüklenirken hata', error: error.message });
    }
});

// Tek post getir
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('category', 'name slug icon color');

        if (!post) {
            return res.status(404).json({ message: 'Post bulunamadı' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Post yüklenirken hata', error: error.message });
    }
});

// Yeni post oluştur
router.post('/', isAuthenticated, async (req, res) => {
    try {
        console.log('[POST /posts] Request received');
        console.log('[POST /posts] Body:', JSON.stringify(req.body));
        console.log('[POST /posts] User:', JSON.stringify(req.userData));

        const { title, content, categoryId } = req.body;

        if (!title || !content) {
            console.log('[POST /posts] Error: Missing title or content');
            return res.status(400).json({
                message: 'Başlık ve içerik gerekli',
                debug: { hasTitle: !!title, hasContent: !!content, body: req.body }
            });
        }

        console.log('[POST /posts] Title:', title);
        console.log('[POST /posts] Content length:', content?.length);

        // Kategori kontrolü (opsiyonel - yoksa "Genel" kullan)
        let category;
        if (categoryId) {
            console.log('[POST /posts] Looking for category:', categoryId);
            category = await Category.findById(categoryId);
        }

        if (!category) {
            console.log('[POST /posts] No category found, looking for Genel...');
            // Varsayılan "Genel" kategorisi
            category = await Category.findOne({ slug: 'genel' });
            if (!category) {
                console.log('[POST /posts] Genel not found, creating...');
                try {
                    category = await Category.create({
                        name: 'Genel',
                        description: 'Genel paylaşımlar',
                        icon: '💬',
                        color: '#6366F1'
                    });
                    console.log('[POST /posts] Genel category created:', category._id);
                } catch (catError) {
                    console.error('[POST /posts] Category creation error:', catError.message);
                    return res.status(500).json({
                        message: 'Kategori oluşturulamadı',
                        error: catError.message,
                        debug: 'category_creation_failed'
                    });
                }
            }
        }

        console.log('[POST /posts] Using category:', category?.name, category?._id);

        const newPost = new Post({
            title,
            content,
            author: req.userData.username || 'Anonim',
            authorId: req.userData.userId,
            category: category._id,
            categoryName: category.name
        });

        console.log('[POST /posts] Saving post...');
        await newPost.save();
        console.log('[POST /posts] Post saved:', newPost._id);

        // Kategori post sayısını güncelle
        await Category.findByIdAndUpdate(category._id, { $inc: { postCount: 1 } });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('[POST /posts] Error:', error.message);
        console.error('[POST /posts] Stack:', error.stack);
        res.status(500).json({
            message: 'Post oluşturulurken hata',
            error: error.message,
            debug: {
                name: error.name,
                bodyReceived: !!req.body,
                bodyKeys: req.body ? Object.keys(req.body) : []
            }
        });
    }
});

// Upvote
router.post('/:id/upvote', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post bulunamadı' });
        }

        const userId = req.userData.userId;

        // Downvote'u kaldır (varsa)
        const downvoteIndex = post.downvotes.indexOf(userId);
        if (downvoteIndex > -1) {
            post.downvotes.splice(downvoteIndex, 1);
        }

        // Upvote toggle
        const upvoteIndex = post.upvotes.indexOf(userId);
        if (upvoteIndex > -1) {
            post.upvotes.splice(upvoteIndex, 1); // Kaldır
        } else {
            post.upvotes.push(userId); // Ekle
        }

        post.calculateVoteScore();
        await post.save();

        res.json({ voteScore: post.voteScore, voted: upvoteIndex === -1 ? 'up' : null });
    } catch (error) {
        res.status(500).json({ message: 'Oy verilirken hata', error: error.message });
    }
});

// Downvote
router.post('/:id/downvote', isAuthenticated, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post bulunamadı' });
        }

        const userId = req.userData.userId;

        // Upvote'u kaldır (varsa)
        const upvoteIndex = post.upvotes.indexOf(userId);
        if (upvoteIndex > -1) {
            post.upvotes.splice(upvoteIndex, 1);
        }

        // Downvote toggle
        const downvoteIndex = post.downvotes.indexOf(userId);
        if (downvoteIndex > -1) {
            post.downvotes.splice(downvoteIndex, 1);
        } else {
            post.downvotes.push(userId);
        }

        post.calculateVoteScore();
        await post.save();

        res.json({ voteScore: post.voteScore, voted: downvoteIndex === -1 ? 'down' : null });
    } catch (error) {
        res.status(500).json({ message: 'Oy verilirken hata', error: error.message });
    }
});

// Yorum ekle
router.post('/:id/comments', isAuthenticated, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Yorum içeriği gerekli' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post bulunamadı' });
        }

        const comment = {
            content: content.trim(),
            author: req.userData.username || 'Anonim',
            authorId: req.userData.userId
        };

        post.comments.push(comment);
        post.updateCommentCount();
        await post.save();

        res.status(201).json(post.comments[post.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ message: 'Yorum eklenirken hata', error: error.message });
    }
});

// Post yorumlarını getir
router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).select('comments commentCount');
        if (!post) {
            return res.status(404).json({ message: 'Post bulunamadı' });
        }
        res.json({ comments: post.comments, count: post.commentCount });
    } catch (error) {
        res.status(500).json({ message: 'Yorumlar yüklenirken hata', error: error.message });
    }
});

module.exports = router;
