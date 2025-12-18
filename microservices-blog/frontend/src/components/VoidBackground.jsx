import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

function VoidBackground() {
    const canvasRef = useRef(null)
    const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })

    // Star configuration
    const starsConfig = useMemo(() => {
        const stars = []
        for (let i = 0; i < 400; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                baseX: Math.random() * window.innerWidth,
                baseY: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                brightness: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleOffset: Math.random() * Math.PI * 2,
            })
        }
        return stars
    }, [])

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        let animationId
        let time = 0

        const animate = () => {
            time += 0.01
            ctx.fillStyle = '#020205'
            ctx.fillRect(0, 0, dimensions.width, dimensions.height)

            // Draw nebula glow
            const gradient1 = ctx.createRadialGradient(
                dimensions.width * 0.2, dimensions.height * 0.2, 0,
                dimensions.width * 0.2, dimensions.height * 0.2, 400
            )
            gradient1.addColorStop(0, 'rgba(109, 40, 217, 0.15)')
            gradient1.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient1
            ctx.fillRect(0, 0, dimensions.width, dimensions.height)

            const gradient2 = ctx.createRadialGradient(
                dimensions.width * 0.8, dimensions.height * 0.8, 0,
                dimensions.width * 0.8, dimensions.height * 0.8, 400
            )
            gradient2.addColorStop(0, 'rgba(6, 182, 212, 0.1)')
            gradient2.addColorStop(1, 'transparent')
            ctx.fillStyle = gradient2
            ctx.fillRect(0, 0, dimensions.width, dimensions.height)

            // Draw stars with mouse interaction
            starsConfig.forEach((star, i) => {
                // Calculate distance from mouse
                const dx = mouseRef.current.x - star.baseX
                const dy = mouseRef.current.y - star.baseY
                const distance = Math.sqrt(dx * dx + dy * dy)
                const maxDistance = 200

                // Stars move away from cursor
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance
                    const angle = Math.atan2(dy, dx)
                    star.x = star.baseX - Math.cos(angle) * force * 50
                    star.y = star.baseY - Math.sin(angle) * force * 50
                } else {
                    // Return to base position
                    star.x += (star.baseX - star.x) * 0.05
                    star.y += (star.baseY - star.y) * 0.05
                }

                // Twinkle effect
                const twinkle = Math.sin(time * star.twinkleSpeed * 100 + star.twinkleOffset) * 0.5 + 0.5
                const alpha = 0.3 + twinkle * 0.7

                // Draw star
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)

                // Color based on distance from mouse
                if (distance < maxDistance) {
                    const colorIntensity = (maxDistance - distance) / maxDistance
                    ctx.fillStyle = `rgba(${109 + colorIntensity * 100}, ${182}, ${212 + colorIntensity * 43}, ${alpha})`

                    // Draw glow for nearby stars
                    const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4)
                    glowGradient.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.5})`)
                    glowGradient.addColorStop(1, 'transparent')
                    ctx.fillStyle = glowGradient
                    ctx.fillRect(star.x - star.size * 4, star.y - star.size * 4, star.size * 8, star.size * 8)

                    ctx.beginPath()
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`
                }

                ctx.fill()
            })

            // Draw cursor trail effect (subtle)
            const trailGradient = ctx.createRadialGradient(
                mouseRef.current.x, mouseRef.current.y, 0,
                mouseRef.current.x, mouseRef.current.y, 100
            )
            trailGradient.addColorStop(0, 'rgba(109, 40, 217, 0.05)')
            trailGradient.addColorStop(1, 'transparent')
            ctx.fillStyle = trailGradient
            ctx.fillRect(0, 0, dimensions.width, dimensions.height)

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [dimensions, starsConfig])

    return (
        <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -10,
                pointerEvents: 'none',
            }}
        />
    )
}

export default VoidBackground
