import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../services/api'
import PostCard from '../components/PostCard'
import AnimatedText from '../components/AnimatedText'

function Home({ user }) {
    const [posts, setPosts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentSort, setCurrentSort] = useState('new')

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
        } catch (error) {
            console.error('Error loading data:', error)
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
        { key: 'new', label: '🆕 Yeni', icon: '🆕' },
        { key: 'top', label: '⭐ Top', icon: '⭐' },
        { key: 'hot', label: '🔥 Hot', icon: '🔥' }
    ]

    return (
        <main className="pt-24 pb-16 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold mb-6"
                    >
                        Uzayın <span className="gradient-text">Derinliklerinden</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/60 max-w-2xl mx-auto mb-8"
                    >
                        Galaksiler arası fikirlerin buluşma noktası. Keşfet, paylaş, bağlan.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4 justify-center"
                    >
                        {user ? (
                            <Link to="/create" className="btn-primary flex items-center gap-2">
                                <span>✦</span>
                                <span>Paylaşım Yap</span>
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn-primary">Aramıza Katıl</Link>
                                <Link to="/login" className="btn-secondary">Giriş Yap</Link>
                            </>
                        )}
                    </motion.div>
                </motion.section>

                {/* Categories */}
                {categories.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <h2 className="text-lg font-bold mb-4 text-white/80">🌌 Galaksiler</h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map((cat) => (
                                <Link
                                    key={cat._id}
                                    to={`/category/${cat.slug}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-nebula-purple/20 border border-white/10 hover:border-nebula-purple/50 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all whitespace-nowrap"
                                >
                                    <span>{cat.icon || '📁'}</span>
                                    <span>{cat.name}</span>
                                    <span className="text-xs opacity-50">{cat.postCount || 0}</span>
                                </Link>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Posts Section */}
                <section>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <h2 className="text-2xl font-display font-bold">
                            🚀 Trend Paylaşımlar
                        </h2>
                        <div className="flex items-center gap-2 bg-white/5 rounded-full p-1">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.key}
                                    onClick={() => setCurrentSort(option.key)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentSort === option.key
                                            ? 'bg-gradient-to-r from-nebula-purple to-nebula-blue text-white'
                                            : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="spinner" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🌑</div>
                            <h3 className="text-xl font-bold mb-2">Henüz paylaşım yok</h3>
                            <p className="text-white/60 mb-6">Bu galaksiyi keşfeden ilk kişi sen ol!</p>
                            <Link to="/create" className="btn-primary">✦ İlk Paylaşımı Yap</Link>
                        </div>
                    ) : (
                        <motion.div
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: { staggerChildren: 0.05 }
                                }
                            }}
                        >
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post._id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <PostCard post={post} onVote={handleVote} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Home
