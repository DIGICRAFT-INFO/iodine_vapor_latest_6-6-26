/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:     { DEFAULT: '#080808', 2: '#0f0f0f', 3: '#141414' },
        cream:  { DEFAULT: '#f5f0ea', muted: '#e8dfd0' },
        gold:   { DEFAULT: '#c9a96e', light: '#e8c88a', dark: '#a8864e' },
        red:    { DEFAULT: '#d63a2f', dark: '#b02f26' },
        purple: { DEFAULT: '#8b5cf6' },
        muted:  '#4a4a4a',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        serif:   ['var(--font-dm-serif)', 'serif'],
        sans:    ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
        'ticker':     'ticker 30s linear infinite',
        'line-grow':  'lineGrow 2s ease-in-out infinite',
        'fade-up':    'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up':   'slideUp 1s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-y':    'scaleY 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        ticker:   { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        lineGrow: { '0%': { transform: 'scaleY(0)', transformOrigin: 'top' }, '50%': { transform: 'scaleY(1)', transformOrigin: 'top' }, '50.01%': { transformOrigin: 'bottom' }, '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' } },
        fadeUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:  { from: { transform: 'translateY(110%)' }, to: { transform: 'translateY(0)' } },
        scaleY:   { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
      },
      backgroundImage: {
        'noise':  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        'scanlines': "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 2px)",
        'hero-grad': 'linear-gradient(135deg, #080808 0%, #141414 100%)',
        'gold-grad': 'linear-gradient(135deg, #c9a96e, #e8c88a)',
        'glass':     'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      },
    },
  },
  plugins: [],
};
