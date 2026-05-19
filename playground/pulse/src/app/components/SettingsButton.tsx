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
                ⚙
            </button>
            {isOpen && <SettingsPanel onClose={() => setIsOpen(false)} />}
        </>
    )
}
