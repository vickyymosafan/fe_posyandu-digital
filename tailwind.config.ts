import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Neutral palette untuk design system
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Petugas Palette (Soft Sage Green)
        sage: {
          50: '#f4f7f6',
          100: '#e3ebe8',
          200: '#c5d9d3',
          300: '#9ebFB6',
          400: '#7c9f95',
          500: '#5F857B', // Primary for Petugas (approx #60857B check contrast)
          600: '#4a6b62',
          700: '#3e564f',
          800: '#344540',
          900: '#2d3936',
          950: '#18201e',
        },
        // Admin Palette (Deep Emerald Green)
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669', // Primary for Admin
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Alert Palette
        coral: {
          50: '#fff1f2',
          500: '#f43f5e', // Rose/Coral
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      minHeight: {
        '44': '44px',
      },
      minWidth: {
        '44': '44px',
      },
    },
  },
  plugins: [],
};

export default config;
