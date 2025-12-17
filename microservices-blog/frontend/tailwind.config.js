/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                space: {
                    900: '#0a0a1a',
                    800: '#0f0f2a',
                    700: '#14143a',
                    600: '#1a1a4a',
                    500: '#252560',
                },
                nebula: {
                    purple: '#8b5cf6',
                    blue: '#3b82f6',
                    pink: '#ec4899',
                    cyan: '#06b6d4',
                },
                star: {
                    white: '#ffffff',
                    yellow: '#fbbf24',
                    blue: '#60a5fa',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Space Grotesk', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'twinkle': 'twinkle 3s ease-in-out infinite',
                'gradient': 'gradient 8s ease infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.3' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'nebula-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            },
        },
    },
    plugins: [],
}
