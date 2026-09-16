/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#05070F',
        deep: '#0C1226',
        ink: '#16203F',
        brass: {
          DEFAULT: '#C9A227',
          light: '#E0B739',
          dark: '#9A7A16',
          muted: 'rgba(201, 162, 39, 0.15)',
        },
        moonlight: '#E6E2D3',
        dust: '#A4AFC4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Almarai"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Almarai"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        almarai: ['"Almarai"', 'system-ui', 'sans-serif'],
        english: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        astral: '0 0 25px -5px rgba(201, 162, 39, 0.2)',
        'astral-lg': '0 0 45px -5px rgba(201, 162, 39, 0.3)',
        moon: '0 0 80px 20px rgba(230, 226, 211, 0.12)',
        'moon-lg': '0 0 120px 40px rgba(230, 226, 211, 0.18)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
