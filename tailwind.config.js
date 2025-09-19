import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#05060c',
        surface: '#11131f',
        primary: '#7c5cff',
        accent: '#1be7ff',
        highlight: '#ffcb05',
        muted: '#717591'
      },
      fontFamily: {
        sans: ['"General Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular']
      },
      maxWidth: {
        content: '72rem'
      },
      boxShadow: {
        glow: '0 0 60px rgba(124, 92, 255, 0.35)'
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-1.5%)' },
          '50%': { transform: 'translateY(2%)' }
        }
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.perspective-1200': {
          perspective: '1200px'
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d'
        }
      })
    })
  ]
}
