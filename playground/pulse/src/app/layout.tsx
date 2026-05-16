import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pulse',
    description: 'Dashboard suivi — XEFI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
