/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Brand Color Palette ─────────────────────────────────
      colors: {
        primary: {
          DEFAULT: '#864c25',
          50:  '#fdf6f0',
          100: '#f9e8d8',
          200: '#f2cead',
          300: '#e8ae7c',
          400: '#d98849',
          500: '#864c25', // ← brand primary (Woody Brown)
          600: '#7a421f',
          700: '#633418',
          800: '#4f2913',
          900: '#3c1f0e',
          950: '#210f06',
        },
        secondary: {
          DEFAULT: '#515427',
          50:  '#f5f6eb',
          100: '#e8ead0',
          200: '#d0d4a3',
          300: '#b3b971',
          400: '#939a46',
          500: '#515427', // ← brand secondary (Deep Olive/Moss)
          600: '#494c22',
          700: '#3a3c1b',
          800: '#2e3016',
          900: '#23250f',
          950: '#131507',
        },
        'brand-bg': {
          DEFAULT: '#fcf5e1', // Creamy Paper
          dark: '#f5eccc',
        },
        'card-bg': {
          DEFAULT: '#fffff3', // Off-White
          dark: '#fffff0',
        },
      },

      // ── Typography ───────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', ...fontFamily.sans],
        mono:    ['"JetBrains Mono"', ...fontFamily.mono],
      },

      // ── Spacing & Sizing ─────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      // ── Border Radius ────────────────────────────────────────
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ── Box Shadows ──────────────────────────────────────────
      boxShadow: {
        'brand-sm':  '0 2px 8px  rgba(134, 76, 37, 0.08)',
        'brand-md':  '0 4px 20px rgba(134, 76, 37, 0.12)',
        'brand-lg':  '0 8px 40px rgba(134, 76, 37, 0.18)',
        'brand-xl':  '0 16px 60px rgba(134, 76, 37, 0.24)',
        'card-hover':'0 20px 60px rgba(134, 76, 37, 0.20), 0 4px 16px rgba(134, 76, 37, 0.12)',
        'inset-top': 'inset 0 2px 4px rgba(134, 76, 37, 0.06)',
      },

      // ── Background Gradients ─────────────────────────────────
      backgroundImage: {
        'brand-radial':
          'radial-gradient(ellipse 70% 50% at 20% 20%, rgba(134,76,37,0.07) 0%, transparent 70%), ' +
          'radial-gradient(ellipse 60% 60% at 80% 80%, rgba(81,84,39,0.06) 0%, transparent 70%)',
        'primary-gradient':
          'linear-gradient(135deg, #864c25 0%, #6a3a1c 100%)',
        'secondary-gradient':
          'linear-gradient(135deg, #515427 0%, #3a3c1b 100%)',
        'card-shine':
          'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)',
        'paper-texture':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },

      // ── Animations ───────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.6s ease both',
        'fade-up-1':  'fade-up 0.6s 0.1s ease both',
        'fade-up-2':  'fade-up 0.6s 0.2s ease both',
        'fade-up-3':  'fade-up 0.6s 0.4s ease both',
        'fade-up-4':  'fade-up 0.6s 0.6s ease both',
        'fade-in':    'fade-in 0.8s ease both',
        'float':      'float 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
      },

      // ── Transition Timing ────────────────────────────────────
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};