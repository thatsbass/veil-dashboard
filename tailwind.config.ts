import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Veil design tokens
        accent: {
          DEFAULT: '#a2d2ff',
          strong: '#6fb5f5',
          soft: '#ecf5ff',
          ink: '#0e2a47',
        },
        ink: {
          DEFAULT: '#050505',
          2: '#282828',
          3: '#6b7280',
          4: '#9aa0a6',
          5: '#c8cdd2',
        },
        surface: {
          DEFAULT: '#fbfbfb',
          2: '#f6f7f8',
        },
        veil: {
          success: '#047857',
          'success-bg': '#ecfdf5',
          error: '#b3261e',
          'error-bg': '#fef2f2',
          warning: '#92400e',
          'warning-bg': '#fffbeb',
          'warning-ink': '#d97706',
        },
        // shadcn semantic tokens
        border: 'rgba(0,0,0,0.07)',
        input: 'rgba(0,0,0,0.07)',
        ring: '#a2d2ff',
        background: '#ffffff',
        foreground: '#050505',
        primary: {
          DEFAULT: '#a2d2ff',
          foreground: '#0e2a47',
        },
        secondary: {
          DEFAULT: '#f6f7f8',
          foreground: '#050505',
        },
        destructive: {
          DEFAULT: '#b3261e',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f6f7f8',
          foreground: '#6b7280',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#050505',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#050505',
        },
      },
      borderRadius: {
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        popover: '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)',
      },
      fontSize: {
        'tiny': '11px',
        'small': '12.5px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config
