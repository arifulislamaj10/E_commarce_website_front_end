/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // VelouraX brand system (spec §2.1)
        matte: '#111827', // Primary — Matte Black
        gold: { DEFAULT: '#D4AF37', soft: '#C9A84C' }, // Secondary — Royal Gold
        emerald: { brand: '#065F46' }, // Accent — Emerald Green
        soft: '#F9FAFB', // Background — Soft White
        ink: '#374151', // Text Gray
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        luxe: '0 10px 40px -12px rgba(17,24,39,0.25)',
      },
    },
  },
  plugins: [],
};
