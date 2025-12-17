import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import StarField from './components/StarField'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'

function App() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        if (token && username) {
            setUser({ username, token })
        }
    }, [])

    const handleLogin = (userData) => {
        setUser(userData)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setUser(null)
    }

    return (
        <div className="min-h-screen relative">
            {/* Background Effects */}
            <StarField />
            <div className="nebula-glow nebula-purple" />
            <div className="nebula-glow nebula-blue" />
            <div className="nebula-glow nebula-pink" />

            {/* Content */}
            <div className="relative z-10">
                <Navbar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/create" element={<CreatePost user={user} />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
