import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import { TypewriterText, SplitText } from '../components/TextEffects'

function CreatePost({ user }) {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        loadCategories()
    }, [user, navigate])

    const loadCategories = async () => {
        try {
            const data = await api.getCategories()
            setCategories(data || [])
        } catch (err) {
            console.error('Categories load error:', err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!title.trim() || !content.trim()) {
            setError('SIGNAL DATA INCOMPLETE')
            return
        }

        setLoading(true)

        try {
            await api.createPost(title, content, categoryId)
            setSuccess(true)
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setError(err.message || 'TRANSMISSION FAILED')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="main-content flex items-center justify-center min-h-screen py-24">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="neon-glass p-8">
                    <div className="text-center mb-8">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">
                            <TypewriterText text="// SIGNAL_TRANSMISSION" delay={200} speed={40} />
                        </div>
                        <h1 className="text-2xl font-display text-[var(--supernova-cyan)]">
                            <SplitText>BROADCAST</SplitText>
                        </h1>
                        <p className="text-[var(--text-muted)] text-xs mt-2 uppercase tracking-wider">
                            Transmit your signal across the void
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="alert alert-error mb-6"
                        >
                            ⚠ {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="alert alert-success mb-6"
                        >
                            ✓ SIGNAL TRANSMITTED — REDIRECTING...
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                Target_Sector
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="input-terminal"
                            >
                                <option value="">GENERAL_BROADCAST</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name?.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                Signal_Header
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-terminal"
                                placeholder="ENTER SIGNAL HEADER..."
                                maxLength={300}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                Signal_Payload
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="input-terminal min-h-[200px] resize-y"
                                placeholder="ENTER TRANSMISSION DATA..."
                                maxLength={10000}
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="btn-terminal btn-primary-terminal flex-1"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="loading-spinner" style={{ width: 16, height: 16 }} />
                                        TRANSMITTING...
                                    </span>
                                ) : (
                                    'BROADCAST SIGNAL'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="btn-terminal"
                            >
                                ABORT
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </main>
    )
}

export default CreatePost
