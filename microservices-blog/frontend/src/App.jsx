import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Components
import CustomCursor from './components/CustomCursor'
import VoidBackground from './components/VoidBackground'
import HUDNavigation from './components/HUDNavigation'
import { WarpOverlay } from './components/TextEffects'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'

function App() {
    const [user, setUser] = useState(null)
    const [isWarping, setIsWarping] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        if (token && username) {
            setUser({ username, token })
        }
    }, [])

    // Trigger warp effect on route change
    useEffect(() => {
        setIsWarping(true)
        const timer = setTimeout(() => setIsWarping(false), 600)
        return () => clearTimeout(timer)
    }, [location.pathname])

    const handleLogin = (userData) => {
        setUser(userData)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setUser(null)
    }

    const pageVariants = {
        initial: {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)'
        },
        animate: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { duration: 0.3 }
        }
    }

    return (
        <div className="min-h-screen">
            {/* Background */}
            <VoidBackground />

            {/* Custom Cursor */}
            <CustomCursor />

            {/* Warp Speed Overlay */}
            <WarpOverlay active={isWarping} />

            {/* HUD Navigation */}
            <HUDNavigation user={user} onLogout={handleLogout} />

            {/* Main Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <Routes location={location}>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create" element={<CreatePost user={user} />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default App
