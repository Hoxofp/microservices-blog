import { useEffect, useRef, useMemo } from 'react'

function VoidBackground() {
    const containerRef = useRef(null)
    const mouseRef = useRef({ x: 0.5, y: 0.5 })

    // Generate stars
    const stars = useMemo(() => {
        const starArray = []
        for (let i = 0; i < 300; i++) {
            const size = Math.random()
            let className = 'star small'
            if (size > 0.9) className = 'star large'
            else if (size > 0.7) className = 'star medium'

            starArray.push({
                id: i,
                className,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
            })
        }
        return starArray
    }, [])

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            }

            if (containerRef.current) {
                const offsetX = (mouseRef.current.x - 0.5) * 30
                const offsetY = (mouseRef.current.y - 0.5) * 30
                containerRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="void-background">
            <div ref={containerRef} style={{ transition: 'transform 0.3s ease-out' }}>
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className={star.className}
                        style={{
                            left: star.left,
                            top: star.top,
                            animationDelay: star.animationDelay,
                            animationDuration: star.animationDuration,
                            animation: `twinkle ${star.animationDuration} ease-in-out ${star.animationDelay} infinite`,
                        }}
                    />
                ))}
            </div>

            {/* Nebula Glows */}
            <div className="nebula nebula-violet" />
            <div className="nebula nebula-cyan" />
        </div>
    )
}

export default VoidBackground
