'use client'

import { useState, useEffect } from 'react'
import { useTranslate } from '@tolgee/react'
import { tolgee, type Lang } from '../Tolgee/index'

type Theme = 'light' | 'dark'

const FONT_SIZES = [
    { label: 'A−', value: 15 },
    { label: 'A',  value: 17 },
    { label: 'A+', value: 19 },
    { label: 'A++', value: 21 },
]

const LANG_OPTIONS: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
]

interface IProps {
    onClose: () => void
}

export default function SettingsPanel({ onClose }: IProps) {
    const { t } = useTranslate()
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

    function applyTheme(theme: Theme) {
        setTheme(theme)
        localStorage.setItem('pulse-theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
    }

    function applyFontSize(size: number) {
        setFontSize(size)
        localStorage.setItem('pulse-font-size', String(size))
        document.documentElement.style.fontSize = `${size}px`
    }

    function applyLang(l: Lang) {
        setLang(l)
        tolgee.changeLanguage(l)
    }

    return (
        <>
            <div className="settings-overlay" onClick={onClose} />
            <div className="settings-panel" role="dialog" aria-label={t('settings_title')}>
                <div className="settings-header">
                    <span className="settings-title">{t('settings_title')}</span>
                    <button className="settings-close" onClick={onClose} aria-label="Fermer">✕</button>
                </div>

                <div className="settings-section">
                    <div className="settings-label">{t('settings_lang')}</div>
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
                    <div className="settings-label">{t('settings_theme')}</div>
                    <div className="settings-seg">
                        <button
                            className={`settings-seg-btn${theme === 'light' ? ' active' : ''}`}
                            onClick={() => applyTheme('light')}
                        >
                            <span className="theme-swatch theme-swatch-light" />
                            {t('settings_light')}
                        </button>
                        <button
                            className={`settings-seg-btn${theme === 'dark' ? ' active' : ''}`}
                            onClick={() => applyTheme('dark')}
                        >
                            <span className="theme-swatch theme-swatch-dark" />
                            {t('settings_dark')}
                        </button>
                    </div>
                </div>

                <div className="settings-section">
                    <div className="settings-label">{t('settings_font_size')}</div>
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
