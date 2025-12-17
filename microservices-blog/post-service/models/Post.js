const mongoose = require('mongoose');

// Yorum şeması (nested)
const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ana post şeması
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },
    content: {
        type: String,
        required: true,
        maxlength: 10000
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    // Upvote/Downvote sistemi
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    voteScore: {
        type: Number,
        default: 0
    },
    // Yorumlar
    comments: [CommentSchema],
    commentCount: {
        type: Number,
        default: 0
    },
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Vote score hesapla
PostSchema.methods.calculateVoteScore = function () {
    this.voteScore = this.upvotes.length - this.downvotes.length;
    return this.voteScore;
};

// Yorum sayısını güncelle
PostSchema.methods.updateCommentCount = function () {
    this.commentCount = this.comments.length;
    return this.commentCount;
};

// Index'ler
PostSchema.index({ category: 1, createdAt: -1 });
PostSchema.index({ voteScore: -1 });
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
