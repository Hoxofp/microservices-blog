import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import { TypewriterText, SplitText } from '../components/TextEffects'

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
            setError('ACCESS KEYS DO NOT MATCH')
            return
        }

        if (password.length < 4) {
            setError('ACCESS KEY TOO SHORT (MIN 4 CHARS)')
            return
        }

        setLoading(true)

        try {
            await api.register(username, password)
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        } catch (err) {
            setError(err.message || 'REGISTRATION FAILED')
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
                            <TypewriterText text="// IDENTITY_PROTOCOL" delay={200} speed={40} />
                        </div>
                        <h1 className="text-2xl font-display text-[var(--supernova-cyan)]">
                            <SplitText>NEW_AGENT</SplitText>
                        </h1>
                        <p className="text-[var(--text-muted)] text-xs mt-2 uppercase tracking-wider">
                            Initialize new identity matrix
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
                            ✓ IDENTITY CREATED — REDIRECTING...
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
                                placeholder="CREATE IDENTIFIER"
                                minLength={3}
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
                                placeholder="MIN 4 CHARACTERS"
                                minLength={4}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                Confirm_Key
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-terminal"
                                placeholder="REPEAT ACCESS KEY"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="btn-terminal btn-primary-terminal w-full"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="loading-spinner" style={{ width: 16, height: 16 }} />
                                    CREATING IDENTITY...
                                </span>
                            ) : (
                                'INITIALIZE AGENT'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-[var(--glass-border)] text-center text-xs text-[var(--text-muted)] uppercase tracking-wider">
                        Already registered? <a href="/login" className="text-[var(--pulsar-violet)] hover:underline">Access_Terminal</a>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}

export default Register
