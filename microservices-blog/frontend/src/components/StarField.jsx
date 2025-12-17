import { useMemo } from 'react'

function StarField() {
    // Generate random stars
    const stars = useMemo(() => {
        const starArray = []
        for (let i = 0; i < 200; i++) {
            starArray.push({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                size: Math.random() * 2 + 1,
                delay: Math.random() * 3,
                duration: Math.random() * 2 + 2,
            })
        }
        return starArray
    }, [])

    return (
        <div className="star-field">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="star"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: `${star.delay}s`,
                        animationDuration: `${star.duration}s`,
                    }}
                />
            ))}
        </div>
    )
}

export default StarField
