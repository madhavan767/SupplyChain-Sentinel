/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          orange: '#ED6A24',
          'orange-hover': '#D85A18',
          'orange-light': '#FFF5F0',
          dark: '#171717',
          muted: '#686868',
          border: '#E5E5E5',
          card: '#FFFFFF',
          bg: '#FAFAFA',
          'red-badge': '#DC2626',
          'red-bg': '#FEF2F2',
          'amber-badge': '#D97706',
          'amber-bg': '#FFFBEB',
          'green-badge': '#16A34A',
          'green-bg': '#F0FDF4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
