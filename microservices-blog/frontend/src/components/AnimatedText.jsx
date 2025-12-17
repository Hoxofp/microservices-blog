import { motion } from 'framer-motion'

function AnimatedText({ text, className = '' }) {
    const letters = text.split('')

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.03 }
        }
    }

    const child = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', damping: 12, stiffness: 200 }
        }
    }

    return (
        <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span key={index} variants={child}>
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </motion.span>
    )
}

export default AnimatedText
