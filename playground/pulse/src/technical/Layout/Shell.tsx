import Sidebar from './Sidebar'
import SettingsButton from './SettingsButton'

interface IProps {
    children: React.ReactNode
    title: string
    subtitle?: string
}

export default function Shell({ children, title, subtitle }: IProps) {
    return (
        <div className="shell">
            <Sidebar />
            <div className="shell-content">
                <header className="shell-header">
                    <div>
                        <h1 className="shell-title">{title}</h1>
                        {subtitle && <p className="shell-subtitle">{subtitle}</p>}
                    </div>
                    <SettingsButton />
                </header>
                <main className="shell-main">{children}</main>
            </div>

            <style>{`
                .shell {
                    display: flex;
                    min-height: 100dvh;
                }
                .shell-content {
                    flex: 1;
                    margin-left: var(--sidebar-width);
                    display: flex;
                    flex-direction: column;
                    min-height: 100dvh;
                }
                .shell-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: var(--chrome-height);
                    padding: 0 1.75rem;
                    border-bottom: 1px solid var(--border);
                    background: var(--surface);
                    position: sticky;
                    top: 0;
                    z-index: 40;
                    flex-shrink: 0;
                }
                .shell-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    color: var(--text);
                    line-height: 1.2;
                }
                .shell-subtitle {
                    font-size: 0.6875rem;
                    color: var(--muted);
                    margin-top: 0.2rem;
                    letter-spacing: 0.01em;
                }
                .shell-main {
                    flex: 1;
                    padding: 1.75rem;
                    background: var(--bg);
                }
            `}</style>
        </div>
    )
}
