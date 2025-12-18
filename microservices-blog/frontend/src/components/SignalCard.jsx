import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function SignalCard({ post, onVote, index }) {
    const cardRef = useRef(null)
    const spotlightRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    const signalId = `SIGNAL_${(index + 1).toString().padStart(3, '0')}`

    const date = new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    // Spotlight effect
    useEffect(() => {
        const card = cardRef.current
        const spotlight = spotlightRef.current

        if (!card || !spotlight) return

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left - 100
            const y = e.clientY - rect.top - 100
            spotlight.style.left = `${x}px`
            spotlight.style.top = `${y}px`
        }

        card.addEventListener('mousemove', handleMouseMove)
        return () => card.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <motion.article
            ref={cardRef}
            className="neon-glass signal-card"
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
        >
            <div
                ref={spotlightRef}
                className="spotlight"
                style={{ opacity: isHovered ? 1 : 0 }}
            />

            {/* Signal Header */}
            <div className="signal-header">
                <span className="signal-id">{signalId}</span>
                <span className="opacity-30">|</span>
                <span className="signal-status">DECRYPTED</span>
                <span className="opacity-30">|</span>
                <span>{post.categoryName || 'CLASSIFIED'}</span>
            </div>

            {/* Signal Title */}
            <h3 className="signal-title">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                >
                    {post.title}
                </motion.span>
            </h3>

            {/* Signal Content */}
            <p className="signal-content">{post.content}</p>

            {/* Signal Footer */}
            <div className="signal-footer">
                <div className="signal-origin">
                    <span>{post.author || 'ANONYMOUS'}</span>
                    <span className="opacity-30">•</span>
                    <span>{date}</span>
                </div>

                <div className="signal-metrics">
                    <button
                        className="metric-btn upvote"
                        onClick={() => onVote && onVote(post._id, 'up')}
                    >
                        ▲ {post.upvotes?.length || 0}
                    </button>
                    <span style={{ color: 'var(--supernova-cyan)', fontWeight: 600 }}>
                        {post.voteScore || 0}
                    </span>
                    <button
                        className="metric-btn downvote"
                        onClick={() => onVote && onVote(post._id, 'down')}
                    >
                        ▼ {post.downvotes?.length || 0}
                    </button>
                    <span className="opacity-50 ml-2">
                        ◈ {post.commentCount || 0}
                    </span>
                </div>
            </div>
        </motion.article>
    )
}

export default SignalCard
