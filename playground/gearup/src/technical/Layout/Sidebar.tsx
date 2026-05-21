import { useState, useEffect } from 'react'
import { LayoutDashboard, Cpu, Package, Wrench, ShoppingCart, ShieldAlert } from 'lucide-react'
import { useTranslate } from '../Tolgee/useTranslate'

interface IProps {
    currentPath: string
    cycle: string
}

const NAV_ITEMS = [
    { path: '/',           icon: LayoutDashboard, key: 'nav_dashboard'  as const },
    { path: '/profiles',   icon: Cpu,             key: 'nav_profiles'   as const },
    { path: '/inventory',  icon: Package,         key: 'nav_inventory'  as const },
    { path: '/repairs',    icon: Wrench,          key: 'nav_repairs'    as const },
    { path: '/orders',     icon: ShoppingCart,    key: 'nav_orders'     as const },
    { path: '/prevention', icon: ShieldAlert,     key: 'nav_prevention' as const },
]

export default function Sidebar({ currentPath, cycle }: IProps) {
    const t = useTranslate()

    return (
        <div style={{ display: 'contents' }}>
            <div className="brand">
                <span className="brand-xefi">XEFI</span>
                <span className="brand-sep" />
                <span className="brand-name">Gearup</span>
            </div>

            <nav className="nav-section">
                <div className="nav-label" style={{ marginBottom: '0.5rem', marginTop: '0.25rem' }}>
                    {t.nav_cycle} {cycle}
                </div>
                {NAV_ITEMS.map(({ path, icon: Icon, key }) => (
                    <a
                        key={path}
                        href={path}
                        className={`nav-item${currentPath === path ? ' active' : ''}`}
                    >
                        <Icon size={16} className="nav-icon" />
                        {t[key]}
                    </a>
                ))}
            </nav>

            <div className="nav-bottom">
                <a href="http://localhost:9999" className="nav-item" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {t.hub_link}
                </a>
            </div>
        </div>
    )
}
