import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

// Glitch Text Effect
export function GlitchText({ children, className = '' }) {
    return (
        <span className={`glitch-text ${className}`} data-text={children}>
            {children}
        </span>
    )
}

// Typewriter Text Effect
export function TypewriterText({ text, delay = 0, speed = 50 }) {
    const [displayText, setDisplayText] = useState('')
    const [showCursor, setShowCursor] = useState(true)

    useEffect(() => {
        let i = 0
        const startTimer = setTimeout(() => {
            const timer = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(text.slice(0, i + 1))
                    i++
                } else {
                    clearInterval(timer)
                    setTimeout(() => setShowCursor(false), 2000)
                }
            }, speed)
            return () => clearInterval(timer)
        }, delay)

        return () => clearTimeout(startTimer)
    }, [text, delay, speed])

    return (
        <span>
            {displayText}
            {showCursor && <span className="text-[var(--supernova-cyan)] animate-pulse">_</span>}
        </span>
    )
}

// Split Text Animation (each letter animated separately)
export function SplitText({ children, className = '' }) {
    const letters = children.split('')

    return (
        <motion.span className={className}>
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    initial={{
                        opacity: 0,
                        y: Math.random() * 100 - 50,
                        x: Math.random() * 50 - 25,
                        rotate: Math.random() * 30 - 15
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        x: 0,
                        rotate: 0
                    }}
                    transition={{
                        delay: index * 0.03,
                        duration: 0.5,
                        type: 'spring',
                        damping: 15
                    }}
                    style={{ display: 'inline-block' }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </motion.span>
    )
}

// Animated Counter
export function AnimatedCounter({ value, duration = 2 }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)

    useEffect(() => {
        const increment = value / (duration * 60)
        const timer = setInterval(() => {
            countRef.current += increment
            if (countRef.current >= value) {
                countRef.current = value
                clearInterval(timer)
            }
            setCount(Math.floor(countRef.current))
        }, 1000 / 60)

        return () => clearInterval(timer)
    }, [value, duration])

    return <span>{count}</span>
}

// Warp Speed Transition Overlay
export function WarpOverlay({ active }) {
    const lines = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        angle: (360 / 50) * i,
        delay: Math.random() * 0.3
    }))

    return (
        <div className={`warp-overlay ${active ? 'active' : ''}`}>
            {lines.map((line) => (
                <motion.div
                    key={line.id}
                    className="warp-line"
                    style={{
                        left: '50%',
                        top: '50%',
                        height: active ? '200vh' : '0',
                        transform: `rotate(${line.angle}deg)`,
                        transformOrigin: 'top center'
                    }}
                    animate={active ? { height: '200vh' } : { height: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: line.delay,
                        ease: 'easeOut'
                    }}
                />
            ))}
        </div>
    )
}
