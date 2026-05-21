'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function MobileMenuButton() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsOpen(false)
        document.documentElement.classList.remove('sidebar-open')
    }, [pathname])

    function toggle() {
        const next = !isOpen
        setIsOpen(next)
        document.documentElement.classList.toggle('sidebar-open', next)
    }

    return (
        <>
            <button className="mobile-menu-btn" onClick={toggle} aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
                {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            {isOpen && <div className="mobile-backdrop" onClick={toggle} />}

            <style>{`
                .mobile-menu-btn {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 2rem;
                    height: 2rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: var(--surface-2);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: color 0.12s, border-color 0.12s;
                    flex-shrink: 0;
                }
                .mobile-menu-btn:hover { color: var(--text); border-color: var(--text-secondary); }
                .mobile-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 49;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(2px);
                }
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: flex; }
                }
            `}</style>
        </>
    )
}
