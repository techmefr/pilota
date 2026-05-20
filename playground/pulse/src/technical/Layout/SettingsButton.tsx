'use client'

import { useState } from 'react'
import SettingsPanel from './SettingsPanel'

export default function SettingsButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                className="pulse-settings-btn"
                onClick={() => setIsOpen(true)}
                aria-label="Réglages"
                title="Réglages"
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
            </button>
            {isOpen && <SettingsPanel onClose={() => setIsOpen(false)} />}
        </>
    )
}
