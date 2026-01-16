/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                abyss: '#020408',
                'deep-teal': '#0F1720',
                'living-coral': '#FF8C69',
            },
            fontFamily: {
                sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
            },
            animation: {
                'breathing': 'breathing 6s ease-in-out infinite',
            },
            keyframes: {
                breathing: {
                    '0%, 100%': { transform: 'translateY(-4px)' },
                    '50%': { transform: 'translateY(4px)' },
                },
            },
            boxShadow: {
                'glass-edge': 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 4px 24px -1px rgba(0,0,0,0.3)',
                'coral-glow': '0 0 30px -5px rgba(255,140,105,0.4)',
            }
        },
    },
    plugins: [],
}
