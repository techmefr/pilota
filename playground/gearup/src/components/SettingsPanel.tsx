import { useState, useEffect } from 'react'
import { X, Sun, Moon } from 'lucide-react'
import type { Lang } from '../lib/i18n'

const LABELS = {
    fr: { title: 'Réglages', lang: 'Langue', theme: 'Thème', fontSize: 'Taille du texte', light: 'Clair', dark: 'Sombre' },
    en: { title: 'Settings', lang: 'Language', theme: 'Theme', fontSize: 'Text size', light: 'Light', dark: 'Dark' },
}

const FONT_SIZES = [
    { label: 'A−', value: 15 },
    { label: 'A',  value: 17 },
    { label: 'A+', value: 19 },
    { label: 'A++', value: 21 },
]

interface IProps {
    onClose: () => void
}

export default function SettingsPanel({ onClose }: IProps) {
    const [lang, setLang] = useState<Lang>('fr')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [fontSize, setFontSize] = useState(17)

    useEffect(() => {
        const savedLang = localStorage.getItem('gearup-lang') as Lang | null
        const savedTheme = localStorage.getItem('gearup-theme') as 'light' | 'dark' | null
        const savedSize = localStorage.getItem('gearup-font-size')
        if (savedLang) setLang(savedLang)
        if (savedTheme) setTheme(savedTheme)
        if (savedSize) setFontSize(parseInt(savedSize))
    }, [])

    function applyLang(l: Lang) {
        setLang(l)
        localStorage.setItem('gearup-lang', l)
        window.dispatchEvent(new CustomEvent('gearup-lang-change', { detail: l }))
    }

    function applyTheme(t: 'light' | 'dark') {
        setTheme(t)
        localStorage.setItem('gearup-theme', t)
        document.documentElement.setAttribute('data-theme', t)
    }

    function applyFontSize(size: number) {
        setFontSize(size)
        localStorage.setItem('gearup-font-size', String(size))
        document.documentElement.style.fontSize = `${size}px`
    }

    const l = LABELS[lang]

    return (
        <>
            <div className="settings-overlay" onClick={onClose} />
            <aside className="settings-panel">
                <div className="settings-header">
                    <span className="settings-title">{l.title}</span>
                    <button className="icon-btn" onClick={onClose} aria-label="Fermer">
                        <X size={16} />
                    </button>
                </div>

                <div className="settings-body">
                    <div className="settings-group">
                        <div className="settings-group-label">{l.lang}</div>
                        <div className="settings-options">
                            <button className={`settings-opt${lang === 'fr' ? ' active' : ''}`} onClick={() => applyLang('fr')}>Français</button>
                            <button className={`settings-opt${lang === 'en' ? ' active' : ''}`} onClick={() => applyLang('en')}>English</button>
                        </div>
                    </div>

                    <div className="settings-group">
                        <div className="settings-group-label">{l.theme}</div>
                        <div className="settings-options">
                            <button className={`settings-opt settings-opt-icon${theme === 'light' ? ' active' : ''}`} onClick={() => applyTheme('light')}>
                                <Sun size={14} />{l.light}
                            </button>
                            <button className={`settings-opt settings-opt-icon${theme === 'dark' ? ' active' : ''}`} onClick={() => applyTheme('dark')}>
                                <Moon size={14} />{l.dark}
                            </button>
                        </div>
                    </div>

                    <div className="settings-group">
                        <div className="settings-group-label">{l.fontSize}</div>
                        <div className="settings-options">
                            {FONT_SIZES.map(({ label, value }) => (
                                <button
                                    key={value}
                                    className={`settings-opt${fontSize === value ? ' active' : ''}`}
                                    onClick={() => applyFontSize(value)}
                                    style={{ fontWeight: 700, minWidth: '3rem', justifyContent: 'center' }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
