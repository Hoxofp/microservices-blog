import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function CustomCursor() {
    const reticleRef = useRef(null)
    const dotRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (reticleRef.current) {
                reticleRef.current.style.left = `${e.clientX}px`
                reticleRef.current.style.top = `${e.clientY}px`
            }
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`
                dotRef.current.style.top = `${e.clientY}px`
            }
        }

        const handleMouseDown = () => {
            if (dotRef.current) {
                dotRef.current.classList.add('clicking')
            }
        }

        const handleMouseUp = () => {
            if (dotRef.current) {
                dotRef.current.classList.remove('clicking')
            }
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    return (
        <>
            <motion.div
                ref={reticleRef}
                className="cursor-reticle"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="ring" />
            </motion.div>
            <motion.div
                ref={dotRef}
                className="cursor-dot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            />
        </>
    )
}

export default CustomCursor
