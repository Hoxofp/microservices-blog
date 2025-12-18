import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import { TypewriterText, SplitText } from '../components/TextEffects'

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
            setError(err.message || 'ACCESS DENIED')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="main-content flex items-center justify-center min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="neon-glass p-8">
                    <div className="text-center mb-8">
                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">
                            <TypewriterText text="// TERMINAL_ACCESS" delay={200} speed={40} />
                        </div>
                        <h1 className="text-2xl font-display text-[var(--supernova-cyan)]">
                            <SplitText>AUTHENTICATION</SplitText>
                        </h1>
                        <p className="text-[var(--text-muted)] text-xs mt-2 uppercase tracking-wider">
                            Enter credentials to access the network
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                Agent_ID
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-terminal"
                                placeholder="ENTER IDENTIFIER"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                Access_Key
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-terminal"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-terminal btn-primary-terminal w-full"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="loading-spinner" style={{ width: 16, height: 16 }} />
                                    AUTHENTICATING...
                                </span>
                            ) : (
                                'INITIATE ACCESS'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[var(--glass-border)] text-center text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        No credentials? <a href="/register" className="text-[var(--pulsar-violet)] hover:underline">Register_Protocol</a>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}

export default Login
