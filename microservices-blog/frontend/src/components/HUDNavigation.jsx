import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

function HUDNavigation({ user, onLogout }) {
    const location = useLocation()
    const [time, setTime] = useState(new Date())
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e) => {
            setCoordinates({
                x: Math.round((e.clientX / window.innerWidth) * 100),
                y: Math.round((e.clientY / window.innerHeight) * 100),
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
    }

    return (
        <div className="hud-container">
            {/* Top Left - Logo & Navigation */}
            <motion.div
                className="hud-element hud-top-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Link to="/" className="hud-logo">MIKROBLOG</Link>
                <div className="mt-4 space-y-1">
                    <Link to="/" className="hud-link">{location.pathname === '/' ? '▸' : ''} Signal Feed</Link>
                    {user ? (
                        <>
                            <Link to="/create" className="hud-link">{location.pathname === '/create' ? '▸' : ''} Transmit</Link>
                            <button onClick={onLogout} className="hud-link text-left w-full">Disconnect</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hud-link">{location.pathname === '/login' ? '▸' : ''} Access</Link>
                            <Link to="/register" className="hud-link">{location.pathname === '/register' ? '▸' : ''} Register</Link>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Top Right - Status */}
            <motion.div
                className="hud-element hud-top-right"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="hud-status">
                    <span className="pulse" />
                    <span>SYSTEM ONLINE</span>
                </div>
                <div className="mt-2 text-xs opacity-60">
                    {formatTime(time)} UTC
                </div>
                {user && (
                    <div className="mt-2 text-xs">
                        <span className="text-[var(--pulsar-violet)]">●</span> {user.username}
                    </div>
                )}
            </motion.div>

            {/* Bottom Left - Coordinates */}
            <motion.div
                className="hud-element hud-bottom-left"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="hud-coordinates">
                    <div>CURSOR_X: {coordinates.x.toString().padStart(3, '0')}</div>
                    <div>CURSOR_Y: {coordinates.y.toString().padStart(3, '0')}</div>
                </div>
            </motion.div>

            {/* Bottom Right - Sector Info */}
            <motion.div
                className="hud-element hud-bottom-right"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="hud-coordinates">
                    <div>SECTOR: 7G-PRIME</div>
                    <div>SIGNAL STRENGTH: ████████░░</div>
                </div>
            </motion.div>
        </div>
    )
}

export default HUDNavigation
