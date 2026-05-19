import { useState } from 'react'
import { Settings } from 'lucide-react'
import SettingsPanel from './SettingsPanel'

interface IProps {
    title: string
}

export default function Topbar({ title }: IProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <span className="page-title">{title}</span>
            <button className="icon-btn" onClick={() => setIsOpen(true)} aria-label="Réglages">
                <Settings size={16} />
            </button>
            {isOpen && <SettingsPanel onClose={() => setIsOpen(false)} />}
        </>
    )
}
