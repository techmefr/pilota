import type { Metadata } from 'next'
import SettingsButton from './components/SettingsButton'

export const metadata: Metadata = {
    title: 'Pulse',
    description: 'Suivi dashboard — Pilota SDK / Next.js 15',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: `
(function(){
    var t=localStorage.getItem('pulse-theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    document.documentElement.setAttribute('data-theme',t);
    var s=localStorage.getItem('pulse-font-size');
    if(s) document.documentElement.style.fontSize=s+'px';
})();
                ` }} />
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                    :root {
                        --bg: #060608; --surface: #0e0e12; --surface-2: #14141a; --border: #1e1e28;
                        --primary: #60a5fa; --text: #f0f0f5; --muted: #6b6b80; --text-secondary: #9090a8;
                        --green: #34d399; --red: #f87171;
                        --shadow: 0 8px 32px rgba(0,0,0,0.5);
                        --radius: 0.75rem; --radius-sm: 0.5rem;
                        --font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
                    }
                    [data-theme="light"] {
                        --bg: #f5f5f7; --surface: #ffffff; --surface-2: #f0f0f4; --border: #d1d1d6;
                        --primary: #2563eb; --text: #1c1c1e; --muted: #8e8e93; --text-secondary: #6e6e73;
                        --green: #34c759; --red: #ff3b30;
                        --shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    body {
                        background: var(--bg);
                        color: var(--text);
                        font-family: var(--font);
                        -webkit-font-smoothing: antialiased;
                        transition: background 0.2s, color 0.2s;
                    }
                    a { color: var(--primary); text-decoration: none; }
                    a:hover { text-decoration: underline; }

                    .pulse-settings-btn {
                        background: var(--surface);
                        border: 1px solid var(--border);
                        border-radius: 50%;
                        width: 2rem;
                        height: 2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: var(--muted);
                        font-size: 1rem;
                        transition: color 0.15s, border-color 0.15s;
                    }
                    .pulse-settings-btn:hover { color: var(--text); border-color: var(--primary); }

                    .settings-overlay {
                        position: fixed; inset: 0; z-index: 900;
                        background: rgba(0,0,0,0.35);
                        backdrop-filter: blur(4px);
                        -webkit-backdrop-filter: blur(4px);
                    }
                    .settings-panel {
                        position: fixed; top: 0; right: 0; bottom: 0;
                        width: 300px; z-index: 1000;
                        background: var(--surface);
                        border-left: 1px solid var(--border);
                        padding: 1.5rem;
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        box-shadow: -8px 0 32px rgba(0,0,0,0.25);
                        animation: slideIn 0.22s cubic-bezier(0.16,1,0.3,1) both;
                    }
                    @keyframes slideIn {
                        from { transform: translateX(100%); }
                        to   { transform: translateX(0); }
                    }
                    .settings-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .settings-title {
                        font-size: 1rem;
                        font-weight: 600;
                        color: var(--text);
                    }
                    .settings-close {
                        background: none; border: none; cursor: pointer;
                        color: var(--muted); font-size: 1rem;
                        width: 1.75rem; height: 1.75rem;
                        border-radius: 50%;
                        display: flex; align-items: center; justify-content: center;
                        transition: background 0.15s, color 0.15s;
                    }
                    .settings-close:hover { background: var(--surface-2); color: var(--text); }
                    .settings-section { display: flex; flex-direction: column; gap: 0.5rem; }
                    .settings-label {
                        font-size: 0.6875rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.08em;
                        color: var(--muted);
                    }
                    .settings-seg {
                        display: flex;
                        gap: 0.25rem;
                        background: var(--surface-2);
                        border-radius: var(--radius-sm);
                        padding: 0.2rem;
                    }
                    .settings-seg-btn {
                        flex: 1;
                        padding: 0.4rem 0.5rem;
                        border-radius: calc(var(--radius-sm) - 2px);
                        border: none;
                        background: transparent;
                        color: var(--text-secondary);
                        font-size: 0.8125rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background 0.12s, color 0.12s;
                        white-space: nowrap;
                    }
                    .settings-seg-btn:hover { color: var(--text); }
                    .settings-seg-btn.active {
                        background: var(--surface);
                        color: var(--primary);
                        font-weight: 600;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.12);
                    }
                `}</style>
            </head>
            <body>{children}</body>
        </html>
    )
}
