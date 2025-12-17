import { motion } from 'framer-motion'

function GlowCard({ children, className = '', delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glow-card ${className}`}
        >
            {children}
        </motion.div>
    )
}

export default GlowCard
