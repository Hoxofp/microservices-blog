import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

function Navbar({ user, onLogout }) {
    const location = useLocation()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glow-card px-6 py-3 flex items-center justify-between"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        <span className="text-xl font-display font-bold gradient-text">
                            MikroBlog
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    to="/create"
                                    className="btn-primary text-sm flex items-center gap-2"
                                >
                                    <span>✦</span>
                                    <span>Paylaş</span>
                                </Link>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-white/60">
                                        👤 {user.username}
                                    </span>
                                    <button
                                        onClick={onLogout}
                                        className="btn-secondary text-sm"
                                    >
                                        Çıkış
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`text-sm font-medium transition-colors ${location.pathname === '/login'
                                            ? 'text-nebula-purple'
                                            : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary text-sm"
                                >
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </nav>
    )
}

export default Navbar
