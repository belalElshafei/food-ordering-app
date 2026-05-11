import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fdf2ef',
          100: '#fae0d8',
          200: '#f5bfb0',
          300: '#ef9582',
          400: '#e66a54',
          500: '#8B3A2A',
          600: '#7a3225',
          700: '#612819',
          800: '#4a1e13',
          900: '#33140d',
          DEFAULT: '#8B3A2A',
        },
        saffron: {
          50: '#fdf9e7',
          100: '#faf0c3',
          200: '#f5e082',
          300: '#edc93d',
          400: '#D4A017',
          500: '#b88512',
          600: '#96690e',
          700: '#734f0b',
          800: '#523808',
          900: '#382606',
          DEFAULT: '#D4A017',
        },
        cream: {
          50: '#FFFEF9',
          100: '#FAF3E0',
          200: '#f5ebc8',
          300: '#eed9a4',
          DEFAULT: '#FAF3E0',
        },
        charcoal: {
          DEFAULT: '#1C1C1C',
          50: '#f7f7f7',
          100: '#e8e8e8',
          200: '#c9c9c9',
          300: '#999999',
          400: '#666666',
          500: '#3d3d3d',
          600: '#2e2e2e',
          700: '#1C1C1C',
          800: '#141414',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #1C1C1C 0%, #2e1810 50%, #1C1C1C 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4A017 0%, #8B3A2A 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(28,28,28,0.7) 0%, rgba(28,28,28,0.95) 100%)',
      },
      animation: {
        'bounce-once': 'bounceOnce 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        bounceOnce: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.4)' },
          '70%': { transform: 'scale(0.9)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 160, 23, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(212, 160, 23, 0)' },
        },
      },
      boxShadow: {
        'warm': '0 4px 24px rgba(139, 58, 42, 0.2)',
        'warm-lg': '0 8px 40px rgba(139, 58, 42, 0.3)',
        'gold': '0 4px 20px rgba(212, 160, 23, 0.3)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
