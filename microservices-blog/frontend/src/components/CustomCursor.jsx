import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function CustomCursor() {
    const reticleRef = useRef(null)
    const dotRef = useRef(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)
    const [trailPositions, setTrailPositions] = useState([])
    const positionRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        let animationId

        const handleMouseMove = (e) => {
            positionRef.current = { x: e.clientX, y: e.clientY }

            if (reticleRef.current) {
                reticleRef.current.style.left = `${e.clientX}px`
                reticleRef.current.style.top = `${e.clientY}px`
            }
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`
                dotRef.current.style.top = `${e.clientY}px`
            }

            // Add to trail
            setTrailPositions(prev => {
                const newPositions = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }]
                return newPositions.slice(-8)
            })
        }

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        // Check for hoverable elements
        const handleMouseOver = (e) => {
            const target = e.target
            const isInteractive =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('hud-link') ||
                target.classList.contains('btn-terminal') ||
                target.classList.contains('metric-btn') ||
                target.classList.contains('neon-glass') ||
                target.classList.contains('signal-card')

            setIsHovering(isInteractive)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseover', handleMouseOver)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleMouseOver)
        }
    }, [])

    return (
        <>
            {/* Trail effect */}
            <AnimatePresence>
                {trailPositions.map((pos, index) => (
                    <motion.div
                        key={pos.id}
                        initial={{ opacity: 0.3, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'fixed',
                            left: pos.x,
                            top: pos.y,
                            width: 4,
                            height: 4,
                            background: '#6D28D9',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            zIndex: 9997,
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Main reticle */}
            <motion.div
                ref={reticleRef}
                className="cursor-reticle"
                animate={{
                    scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
                    borderColor: isHovering ? '#06B6D4' : '#6D28D9'
                }}
                transition={{ duration: 0.15 }}
                style={{
                    position: 'fixed',
                    width: isHovering ? 60 : 40,
                    height: isHovering ? 60 : 40,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {/* Cross lines */}
                <div style={{
                    position: 'absolute',
                    width: 2,
                    height: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: isHovering ? '#06B6D4' : '#06B6D4',
                    boxShadow: `0 0 10px ${isHovering ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.5)'}`,
                    transition: 'all 0.15s ease',
                }} />
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: 2,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: isHovering ? '#06B6D4' : '#06B6D4',
                    boxShadow: `0 0 10px ${isHovering ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.5)'}`,
                    transition: 'all 0.15s ease',
                }} />

                {/* Outer ring */}
                <motion.div
                    style={{
                        position: 'absolute',
                        inset: 4,
                        border: `1px solid ${isHovering ? '#06B6D4' : '#6D28D9'}`,
                        borderRadius: '50%',
                        boxShadow: `0 0 15px ${isHovering ? 'rgba(6, 182, 212, 0.5)' : 'rgba(109, 40, 217, 0.3)'}`,
                    }}
                    animate={{
                        rotate: isHovering ? 180 : 0,
                        scale: isClicking ? 0.8 : 1
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Corner brackets */}
                {isHovering && (
                    <>
                        <div style={{ position: 'absolute', top: -5, left: -5, width: 10, height: 10, borderTop: '2px solid #06B6D4', borderLeft: '2px solid #06B6D4' }} />
                        <div style={{ position: 'absolute', top: -5, right: -5, width: 10, height: 10, borderTop: '2px solid #06B6D4', borderRight: '2px solid #06B6D4' }} />
                        <div style={{ position: 'absolute', bottom: -5, left: -5, width: 10, height: 10, borderBottom: '2px solid #06B6D4', borderLeft: '2px solid #06B6D4' }} />
                        <div style={{ position: 'absolute', bottom: -5, right: -5, width: 10, height: 10, borderBottom: '2px solid #06B6D4', borderRight: '2px solid #06B6D4' }} />
                    </>
                )}
            </motion.div>

            {/* Center dot */}
            <motion.div
                ref={dotRef}
                animate={{
                    scale: isClicking ? 2 : isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? '#06B6D4' : '#6D28D9'
                }}
                transition={{ duration: 0.1 }}
                style={{
                    position: 'fixed',
                    width: 8,
                    height: 8,
                    background: '#6D28D9',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: `0 0 20px ${isHovering ? 'rgba(6, 182, 212, 0.8)' : 'rgba(109, 40, 217, 0.6)'}`,
                }}
            />
        </>
    )
}

export default CustomCursor
