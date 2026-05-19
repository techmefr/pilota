import { useState, useEffect } from 'react'
import { LayoutDashboard, Cpu, Package, Wrench, ShoppingCart, ShieldAlert, Moon, Sun } from 'lucide-react'
import { getTranslations } from '../lib/i18n'
import type { Lang } from '../lib/i18n'

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
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [lang, setLang] = useState<Lang>('fr')

    useEffect(() => {
        const savedTheme = localStorage.getItem('gearup-theme') as 'light' | 'dark' | null
        if (savedTheme) setTheme(savedTheme)
        const savedLang = localStorage.getItem('gearup-lang') as Lang | null
        if (savedLang) setLang(savedLang)
    }, [])

    function toggleTheme() {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        localStorage.setItem('gearup-theme', next)
        document.documentElement.setAttribute('data-theme', next)
    }

    function switchLang(l: Lang) {
        setLang(l)
        localStorage.setItem('gearup-lang', l)
        window.dispatchEvent(new CustomEvent('gearup-lang-change', { detail: l }))
    }

    const t = getTranslations(lang)

    return (
        <>
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
                <div className="lang-toggle" style={{ alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                    <button className={`lang-btn${lang === 'fr' ? ' active' : ''}`} onClick={() => switchLang('fr')}>FR</button>
                    <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => switchLang('en')}>EN</button>
                </div>
                <button className="nav-item" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center' }}>
                    {theme === 'dark'
                        ? <Sun size={16} className="nav-icon" />
                        : <Moon size={16} className="nav-icon" />
                    }
                    {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                </button>
                <a href="http://localhost:9999" className="nav-item" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {t.hub_link}
                </a>
            </div>
        </>
    )
}
