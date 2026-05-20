import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/technical/**/*.{ts,tsx}',
        './src/functional/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: 'var(--bg)',
                surface: 'var(--surface)',
                'surface-2': 'var(--surface-2)',
                border: 'var(--border)',
                primary: 'var(--primary)',
                text: 'var(--text)',
                muted: 'var(--muted)',
                'text-secondary': 'var(--text-secondary)',
                success: 'var(--green)',
                danger: 'var(--red)',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: 'var(--radius)',
                sm: 'var(--radius-sm)',
            },
            boxShadow: {
                DEFAULT: 'var(--shadow)',
            },
        },
    },
    plugins: [],
}

export default config
