import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

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
            setError('Başlık ve içerik zorunludur!')
            return
        }

        setLoading(true)

        try {
            await api.createPost(title, content, categoryId)
            setSuccess(true)
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setError(err.message || 'Paylaşım başarısız')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="glow-card p-8">
                    <div className="text-center mb-8">
                        <span className="text-5xl mb-4 block">✍️</span>
                        <h1 className="text-3xl font-display font-bold gradient-text">
                            Yeni Paylaşım
                        </h1>
                        <p className="text-white/60 mt-2">
                            Fikirlerini galaksiyle paylaş
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6"
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6"
                        >
                            ✓ Paylaşımın yayınlandı! 🎉
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Galaksi (Kategori)
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="input-field"
                            >
                                <option value="">💬 Genel</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.icon || '📁'} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Başlık
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="input-field"
                                placeholder="Dikkat çekici bir başlık..."
                                maxLength={300}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                İçerik
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="input-field min-h-[200px] resize-y"
                                placeholder="Düşüncelerini paylaş, bir hikaye anlat, soru sor..."
                                maxLength={10000}
                                required
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="spinner" style={{ width: 24, height: 24 }} />
                                ) : (
                                    <>
                                        <span>🚀</span>
                                        <span>Paylaş</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="btn-secondary px-6"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </main>
    )
}

export default CreatePost
