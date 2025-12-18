import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import SignalCard from '../components/SignalCard'
import { SplitText, TypewriterText, AnimatedCounter } from '../components/TextEffects'

function Home({ user }) {
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentSort, setCurrentSort] = useState('new')
    const [stats, setStats] = useState({ signals: 0, sectors: 0, agents: 0 })

    useEffect(() => {
        loadData()
    }, [currentSort])

    const loadData = async () => {
        setLoading(true)
        try {
            const [postsData, categoriesData] = await Promise.all([
                api.getPosts(currentSort),
                api.getCategories()
            ])
            setPosts(postsData || [])
            setCategories(categoriesData || [])
            setStats({
                signals: postsData?.length || 0,
                sectors: categoriesData?.length || 0,
                agents: Math.floor(Math.random() * 100) + 50
            })
        } catch (error) {
            console.error('Error loading data:', error)
            setPosts([])
            setCategories([])
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (postId, direction) => {
        if (!user) {
            window.location.href = '/login'
            return
        }
        try {
            if (direction === 'up') {
                await api.upvote(postId)
            } else {
                await api.downvote(postId)
            }
            loadData()
        } catch (error) {
            console.error('Vote error:', error)
        }
    }

    const sortOptions = [
        { key: 'new', label: 'RECENT' },
        { key: 'top', label: 'TOP' },
        { key: 'hot', label: 'TRENDING' }
    ]

    return (
        <main className="main-content">
            {/* Hero Terminal */}
            <section className="hero-terminal">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="text-xs text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">
                        <TypewriterText text="QUANTUM OBSERVATION TERMINAL v2.0.4" delay={500} speed={30} />
                    </div>

                    <h1 className="hero-title">
                        <SplitText>SIGNAL_FEED</SplitText>
                    </h1>

                    <p className="hero-subtitle">
                        Intercepting transmissions from across the void
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="hero-stats"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="hero-stat">
                        <div className="hero-stat-value">
                            <AnimatedCounter value={stats.signals} />
                        </div>
                        <div className="hero-stat-label">Signals</div>
                    </div>
                    <div className="hero-stat">
                        <div className="hero-stat-value">
                            <AnimatedCounter value={stats.sectors} />
                        </div>
                        <div className="hero-stat-label">Sectors</div>
                    </div>
                    <div className="hero-stat">
                        <div className="hero-stat-value">
                            <AnimatedCounter value={stats.agents} />
                        </div>
                        <div className="hero-stat-label">Agents</div>
                    </div>
                </motion.div>
            </section>

            {/* Sort Controls */}
            <motion.div
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
          // FILTER_SIGNALS
                </div>
                <div className="flex gap-2">
                    {sortOptions.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setCurrentSort(option.key)}
                            className={`px-4 py-2 text-xs uppercase tracking-wider transition-all ${currentSort === option.key
                                    ? 'text-[var(--supernova-cyan)] border-b border-[var(--supernova-cyan)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Signal List */}
            {loading ? (
                <div className="loading-terminal">
                    <div className="loading-spinner" />
                    <div className="loading-text">
                        <TypewriterText text="DECRYPTING SIGNALS..." speed={50} />
                    </div>
                </div>
            ) : posts.length === 0 ? (
                <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-4xl mb-4 opacity-30">◉</div>
                    <h3 className="text-lg font-display mb-2">NO SIGNALS DETECTED</h3>
                    <p className="text-[var(--text-muted)] text-sm mb-6">
                        The void is silent. Be the first to transmit.
                    </p>
                    <a href="/create" className="btn-terminal btn-primary-terminal">
                        INITIATE TRANSMISSION
                    </a>
                </motion.div>
            ) : (
                <div className="signal-grid">
                    {posts.map((post, index) => (
                        <SignalCard
                            key={post._id}
                            post={post}
                            index={index}
                            onVote={handleVote}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}

export default Home
