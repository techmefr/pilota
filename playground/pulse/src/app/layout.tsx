import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pulse',
    description: 'Suivi dashboard — Pilota SDK / Next.js 15',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                    :root {
                        --bg: #060608; --surface: #0e0e12; --border: #1e1e28;
                        --primary: #60a5fa; --text: #f0f0f5; --muted: #6b6b80;
                        --green: #34d399; --red: #f87171;
                    }
                    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; }
                    a { color: var(--primary); text-decoration: none; }
                    a:hover { text-decoration: underline; }
                `}</style>
            </head>
            <body>{children}</body>
        </html>
    )
}
