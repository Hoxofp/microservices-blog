import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

function Login({ onLogin }) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await api.login(username, password)

            if (result.token) {
                localStorage.setItem('token', result.token)
                localStorage.setItem('username', username)
                onLogin({ username, token: result.token })
                navigate('/')
            }
        } catch (err) {
            setError(err.message || 'Giriş başarısız')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-6 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glow-card p-8">
                    <div className="text-center mb-8">
                        <span className="text-5xl mb-4 block">👋</span>
                        <h1 className="text-3xl font-display font-bold gradient-text">
                            Tekrar Hoş Geldin
                        </h1>
                        <p className="text-white/60 mt-2">
                            Uzay macerasına devam et
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Kullanıcı Adı
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="uzay_gezgini"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="spinner" style={{ width: 24, height: 24 }} />
                            ) : (
                                <>
                                    <span>🚀</span>
                                    <span>Giriş Yap</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center text-white/60">
                        Hesabın yok mu?{' '}
                        <Link to="/register" className="text-nebula-purple hover:underline">
                            Hemen oluştur
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}

export default Login
