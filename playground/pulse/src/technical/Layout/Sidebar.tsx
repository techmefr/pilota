'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Activity,
    Target,
    CalendarDays,
    Package,
    Server,
    Info,
    TrendingUp,
    Trophy,
    LayoutKanban,
    ChevronRight,
} from 'lucide-react'
import { clsx } from 'clsx'

const NAV = [
    { label: 'Santé projets',    href: '/health',     icon: Activity },
    { label: 'Objectifs',        href: '/objectives',  icon: Target },
    { label: 'Congés / Équipe',  href: '/team',        icon: CalendarDays },
    { label: 'Livraisons',       href: '/deliveries',  icon: Package },
    { label: 'DevOps',           href: '/devops',      icon: Server },
    { label: 'Infos semaine',    href: '/week',        icon: Info },
    { label: 'Money Maker',      href: '/revenue',     icon: TrendingUp },
    { label: 'Contrats',         href: '/contracts',   icon: Trophy },
    { label: 'Missions',         href: '/missions',    icon: LayoutKanban },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <span className="sidebar-logo-mark">P</span>
                <div>
                    <p className="sidebar-name">Pulse</p>
                    <p className="sidebar-sub">Dashboard équipe</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {NAV.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx('sidebar-link', isActive && 'sidebar-link-active')}
                        >
                            <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{label}</span>
                            {isActive && <ChevronRight size={12} className="ml-auto opacity-50" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <a
                    href="http://localhost:9999"
                    className="sidebar-hub-link"
                    target="_blank"
                    rel="noopener"
                >
                    ← Hub
                </a>
            </div>

            <style>{`
                .sidebar {
                    width: var(--sidebar-width);
                    min-height: 100dvh;
                    background: var(--surface);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    z-index: 50;
                }
                .sidebar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    padding: 1.25rem 1rem;
                    border-bottom: 1px solid var(--border);
                }
                .sidebar-logo-mark {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 0.5rem;
                    background: var(--primary);
                    color: white;
                    font-weight: 800;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .sidebar-name {
                    font-size: 0.9375rem;
                    font-weight: 700;
                    color: var(--text);
                    line-height: 1.2;
                }
                .sidebar-sub {
                    font-size: 0.6875rem;
                    color: var(--muted);
                    line-height: 1.2;
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 0.75rem 0.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.125rem;
                    overflow-y: auto;
                }
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.625rem;
                    border-radius: var(--radius-sm);
                    color: var(--text-secondary);
                    font-size: 0.8125rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: background 0.12s, color 0.12s;
                    white-space: nowrap;
                }
                .sidebar-link:hover {
                    background: var(--surface-2);
                    color: var(--text);
                    text-decoration: none;
                }
                .sidebar-link-active {
                    background: color-mix(in srgb, var(--primary) 12%, transparent);
                    color: var(--primary);
                    font-weight: 600;
                }
                .sidebar-link-active:hover {
                    background: color-mix(in srgb, var(--primary) 16%, transparent);
                    color: var(--primary);
                }
                .sidebar-footer {
                    padding: 0.75rem 1rem;
                    border-top: 1px solid var(--border);
                }
                .sidebar-hub-link {
                    font-size: 0.75rem;
                    color: var(--muted);
                    text-decoration: none;
                    transition: color 0.12s;
                }
                .sidebar-hub-link:hover {
                    color: var(--text-secondary);
                    text-decoration: none;
                }
            `}</style>
        </aside>
    )
}
