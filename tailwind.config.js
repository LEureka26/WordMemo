/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E8A87C',
        'primary-dark': '#D4956A',
        secondary: '#85D3B2',
        accent: '#F9D5A7',
        'accent-light': '#FEF3E2',
        'warm-bg': '#FFF8F0',
        'warm-card': '#FFFFFF',
        'text-primary': '#3D2914',
        'text-secondary': '#6B5A42',
        'text-muted': '#9A8B78',
        success: '#6BCB77',
        error: '#FF6B6B',
        warning: '#FFD93D',
      },
      borderRadius: {
        'sm': '12px',
        'md': '20px',
        'lg': '28px',
        'xl': '36px',
      },
      boxShadow: {
        'sm': '0 4px 16px rgba(232, 168, 124, 0.15)',
        'md': '0 8px 32px rgba(232, 168, 124, 0.15)',
        'lg': '0 16px 48px rgba(232, 168, 124, 0.15)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      }
    },
  },
  plugins: [],
}
