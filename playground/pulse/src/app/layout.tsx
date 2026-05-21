import type { Metadata } from 'next'
import './globals.css'
import TolgeeClientProvider from '../technical/Tolgee/TolgeeClientProvider'

export const metadata: Metadata = {
    title: 'Pulse — Dashboard équipe',
    description: 'Dashboard hebdomadaire XEFI — Pilota SDK / Next.js 15',
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
            </head>
            <body>
                <style>{`
                    .pulse-settings-btn {
                        background: var(--surface-2);
                        border: 1px solid var(--border);
                        border-radius: 50%;
                        width: 2rem;
                        height: 2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: var(--muted);
                        transition: color 0.15s, border-color 0.15s;
                    }
                    .pulse-settings-btn:hover { color: var(--text); border-color: var(--primary); }

                    .settings-overlay {
                        position: fixed; inset: 0; z-index: 900;
                        background: rgba(0,0,0,0.3);
                        backdrop-filter: blur(4px);
                    }
                    .settings-panel {
                        position: fixed; top: 0; right: 0; bottom: 0;
                        width: 280px; z-index: 1000;
                        background: var(--surface);
                        border-left: 1px solid var(--border);
                        padding: 1.5rem;
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        box-shadow: -8px 0 32px rgba(0,0,0,0.2);
                        animation: slideIn 0.22s cubic-bezier(0.16,1,0.3,1) both;
                    }
                    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                    .settings-header { display: flex; align-items: center; justify-content: space-between; }
                    .settings-title { font-size: 0.9375rem; font-weight: 600; color: var(--text); }
                    .settings-close {
                        background: none; border: none; cursor: pointer;
                        color: var(--muted); font-size: 0.875rem;
                        width: 1.75rem; height: 1.75rem;
                        border-radius: 50%;
                        display: flex; align-items: center; justify-content: center;
                    }
                    .settings-close:hover { background: var(--surface-2); color: var(--text); }
                    .settings-section { display: flex; flex-direction: column; gap: 0.5rem; }
                    .settings-label {
                        font-size: 0.6875rem; font-weight: 700;
                        text-transform: uppercase; letter-spacing: 0.08em;
                        color: var(--muted);
                    }
                    .settings-seg {
                        display: flex; gap: 0.25rem;
                        background: var(--surface-2); border-radius: var(--radius-sm); padding: 0.2rem;
                    }
                    .settings-seg-btn {
                        flex: 1; padding: 0.4rem 0.5rem;
                        border-radius: calc(var(--radius-sm) - 2px);
                        border: none; background: transparent;
                        color: var(--text-secondary);
                        font-size: 0.8125rem; font-weight: 500;
                        cursor: pointer; transition: background 0.12s, color 0.12s;
                        white-space: nowrap;
                        display: flex; align-items: center; justify-content: center; gap: 0.375rem;
                    }
                    .settings-seg-btn:hover { color: var(--text); }
                    .settings-seg-btn.active {
                        background: var(--surface); color: var(--primary); font-weight: 600;
                        box-shadow: 0 1px 4px rgba(0,0,0,0.12);
                    }
                    .theme-swatch {
                        width: 10px; height: 10px; border-radius: 50%;
                        display: inline-block; flex-shrink: 0;
                    }
                    .theme-swatch-light { background: #f5f5f7; border: 1.5px solid #d1d1d6; }
                    .theme-swatch-dark  { background: #060608; border: 1.5px solid #3a3a4a; }
                `}</style>
                <TolgeeClientProvider>{children}</TolgeeClientProvider>
            </body>
        </html>
    )
}
