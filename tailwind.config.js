/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Bangla is the default typeface across the whole site.
        sans: ['"Noto Sans Bengali"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#050a1f',
          900: '#070d24',
          850: '#0a1230',
          800: '#0e1838',
          700: '#152248',
        },
        electric: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          purple: '#a855f7',
          cyan: '#22d3ee',
        },
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(99, 102, 241, 0.55)',
        'glow-blue': '0 10px 40px -12px rgba(59, 130, 246, 0.6)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #3b82f6 0%, #6366f1 45%, #a855f7 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
