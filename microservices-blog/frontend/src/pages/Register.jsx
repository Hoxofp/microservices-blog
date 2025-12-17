import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor!')
            return
        }

        if (password.length < 4) {
            setError('Şifre en az 4 karakter olmalı')
            return
        }

        setLoading(true)

        try {
            await api.register(username, password)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.message || 'Kayıt başarısız')
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
                        <span className="text-5xl mb-4 block">🚀</span>
                        <h1 className="text-3xl font-display font-bold gradient-text">
                            Aramıza Katıl
                        </h1>
                        <p className="text-white/60 mt-2">
                            Galaksiler arası yolculuğa başla
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
                            ✓ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsun...
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
                                placeholder="benzersiz_isim"
                                minLength={3}
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
                                placeholder="En az 4 karakter"
                                minLength={4}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Şifre Tekrar
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                placeholder="Şifreyi tekrar gir"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="spinner" style={{ width: 24, height: 24 }} />
                            ) : (
                                <>
                                    <span>✦</span>
                                    <span>Hesap Oluştur</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center text-white/60">
                        Zaten hesabın var mı?{' '}
                        <Link to="/login" className="text-nebula-purple hover:underline">
                            Giriş yap
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}

export default Register
