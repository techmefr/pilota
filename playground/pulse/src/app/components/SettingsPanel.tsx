'use client'

import { useState, useEffect } from 'react'

type Lang = 'fr' | 'en' | 'de'
type Theme = 'light' | 'dark'

const LABELS = {
    fr: { title: 'Réglages', lang: 'Langue', theme: 'Thème', fontSize: 'Taille du texte', light: 'Clair', dark: 'Sombre', close: 'Fermer' },
    en: { title: 'Settings', lang: 'Language', theme: 'Theme', fontSize: 'Text size', light: 'Light', dark: 'Dark', close: 'Close' },
    de: { title: 'Einstellungen', lang: 'Sprache', theme: 'Thema', fontSize: 'Schriftgröße', light: 'Hell', dark: 'Dunkel', close: 'Schließen' },
}

const FONT_SIZES = [
    { label: 'A−', value: 15 },
    { label: 'A',  value: 17 },
    { label: 'A+', value: 19 },
    { label: 'A++', value: 21 },
]

const LANG_OPTIONS: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
]

interface IProps {
    onClose: () => void
}

export default function SettingsPanel({ onClose }: IProps) {
    const [lang, setLang] = useState<Lang>('fr')
    const [theme, setTheme] = useState<Theme>('dark')
    const [fontSize, setFontSize] = useState(17)

    useEffect(() => {
        const savedLang = localStorage.getItem('pulse-lang') as Lang | null
        const savedTheme = localStorage.getItem('pulse-theme') as Theme | null
        const savedSize = localStorage.getItem('pulse-font-size')
        if (savedLang) setLang(savedLang)
        if (savedTheme) setTheme(savedTheme)
        if (savedSize) setFontSize(parseInt(savedSize))
    }, [])

    function applyTheme(t: Theme) {
        setTheme(t)
        localStorage.setItem('pulse-theme', t)
        document.documentElement.setAttribute('data-theme', t)
    }

    function applyFontSize(size: number) {
        setFontSize(size)
        localStorage.setItem('pulse-font-size', String(size))
        document.documentElement.style.fontSize = `${size}px`
    }

    function applyLang(l: Lang) {
        setLang(l)
        localStorage.setItem('pulse-lang', l)
    }

    const lbl = LABELS[lang]

    return (
        <>
            <div className="settings-overlay" onClick={onClose} />
            <div className="settings-panel" role="dialog" aria-label={lbl.title}>
                <div className="settings-header">
                    <span className="settings-title">{lbl.title}</span>
                    <button className="settings-close" onClick={onClose} aria-label={lbl.close}>✕</button>
                </div>

                <div className="settings-section">
                    <div className="settings-label">{lbl.lang}</div>
                    <div className="settings-seg">
                        {LANG_OPTIONS.map(({ code, label }) => (
                            <button
                                key={code}
                                className={`settings-seg-btn${lang === code ? ' active' : ''}`}
                                onClick={() => applyLang(code)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="settings-section">
                    <div className="settings-label">{lbl.theme}</div>
                    <div className="settings-seg">
                        <button
                            className={`settings-seg-btn${theme === 'light' ? ' active' : ''}`}
                            onClick={() => applyTheme('light')}
                        >
                            ☀ {lbl.light}
                        </button>
                        <button
                            className={`settings-seg-btn${theme === 'dark' ? ' active' : ''}`}
                            onClick={() => applyTheme('dark')}
                        >
                            ☾ {lbl.dark}
                        </button>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="settings-label">{lbl.fontSize}</div>
                    <div className="settings-seg">
                        {FONT_SIZES.map(({ label, value }) => (
                            <button
                                key={value}
                                className={`settings-seg-btn${fontSize === value ? ' active' : ''}`}
                                onClick={() => applyFontSize(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
