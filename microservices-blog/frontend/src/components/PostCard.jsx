function PostCard({ post, onVote }) {
    const date = new Date(post.createdAt).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short'
    })

    const authorInitial = (post.author || 'A')[0].toUpperCase()

    return (
        <article className="glow-card p-6">
            {/* Category */}
            <span className="category-badge mb-4 inline-block">
                {post.category?.icon || '📁'} {post.categoryName || 'Genel'}
            </span>

            {/* Title */}
            <h3 className="text-xl font-display font-bold mb-3 text-white">
                {post.title}
            </h3>

            {/* Content Preview */}
            <p className="text-white/60 mb-4 line-clamp-3">
                {post.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {/* Author */}
                <div className="flex items-center gap-3 text-sm text-white/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula-purple to-nebula-blue flex items-center justify-center text-white font-bold text-xs">
                        {authorInitial}
                    </div>
                    <span>{post.author || 'Anonim'}</span>
                    <span>•</span>
                    <span>{date}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Votes */}
                    <div className="flex items-center bg-white/5 rounded-full px-1">
                        <button
                            onClick={() => onVote && onVote(post._id, 'up')}
                            className="vote-btn upvote"
                        >
                            ▲
                        </button>
                        <span className="text-sm font-bold text-white min-w-[2rem] text-center">
                            {post.voteScore || 0}
                        </span>
                        <button
                            onClick={() => onVote && onVote(post._id, 'down')}
                            className="vote-btn downvote"
                        >
                            ▼
                        </button>
                    </div>

                    {/* Comments */}
                    <span className="text-sm text-white/40 flex items-center gap-1">
                        💬 {post.commentCount || 0}
                    </span>
                </div>
            </div>
        </article>
    )
}

export default PostCard
