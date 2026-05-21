'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Play, Pause, SkipForward, Monitor } from 'lucide-react'

const ROUTES = [
    '/health',
    '/objectives',
    '/team',
    '/deliveries',
    '/devops',
    '/week',
    '/revenue',
    '/contracts',
    '/missions',
]

const DURATIONS = [
    { label: '15s', value: 15 },
    { label: '30s', value: 30 },
    { label: '1min', value: 60 },
    { label: '2min', value: 120 },
]

export default function PresentationControls() {
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [duration, setDuration] = useState(30)
    const [remaining, setRemaining] = useState(30)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const currentIndex = ROUTES.indexOf(pathname)

    const goNext = useCallback(() => {
        const next = ROUTES[(currentIndex + 1) % ROUTES.length]
        router.push(next)
    }, [currentIndex, router])

    useEffect(() => {
        if (!isRunning) return
        setRemaining(duration)
        intervalRef.current = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) {
                    goNext()
                    return duration
                }
                return prev - 1
            })
        }, 1000)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isRunning, duration, goNext])

    function toggle() {
        setIsRunning(r => {
            if (!r) setRemaining(duration)
            return !r
        })
    }

    function stop() {
        setIsRunning(false)
        setRemaining(duration)
        setIsOpen(false)
    }

    function changeDuration(d: number) {
        setDuration(d)
        setRemaining(d)
        if (isRunning) {
            setIsRunning(false)
            setTimeout(() => setIsRunning(true), 50)
        }
    }

    const progress = ((duration - remaining) / duration) * 100

    return (
        <>
            <button
                className={`pres-btn${isRunning ? ' pres-btn-active' : ''}`}
                onClick={() => setIsOpen(o => !o)}
                title="Mode présentation"
                aria-label="Mode présentation"
            >
                <Monitor size={14} />
                {isRunning && (
                    <span className="pres-btn-counter">{remaining}s</span>
                )}
            </button>

            {isOpen && (
                <div className="pres-panel">
                    <div className="pres-panel-header">
                        <span className="pres-panel-title">Présentation</span>
                        <button className="pres-close" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="pres-durations">
                        {DURATIONS.map(d => (
                            <button
                                key={d.value}
                                className={`pres-dur-btn${duration === d.value ? ' active' : ''}`}
                                onClick={() => changeDuration(d.value)}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>

                    {isRunning && (
                        <div className="pres-progress-wrap">
                            <div className="pres-progress-track">
                                <div
                                    className="pres-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="pres-progress-label">
                                {ROUTES[(currentIndex + 1) % ROUTES.length].slice(1)} dans {remaining}s
                            </span>
                        </div>
                    )}

                    <div className="pres-actions">
                        <button className={`pres-action-btn${isRunning ? ' pres-action-pause' : ' pres-action-play'}`} onClick={toggle}>
                            {isRunning ? <Pause size={14} /> : <Play size={14} />}
                            {isRunning ? 'Pause' : 'Lancer'}
                        </button>
                        {isRunning && (
                            <button className="pres-action-btn pres-action-skip" onClick={goNext}>
                                <SkipForward size={14} />
                                Suivant
                            </button>
                        )}
                        {isRunning && (
                            <button className="pres-action-btn pres-action-stop" onClick={stop}>
                                Arrêter
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .pres-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.375rem 0.625rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: var(--surface-2);
                    color: var(--muted);
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: color 0.12s, border-color 0.12s, background 0.12s;
                }
                .pres-btn:hover {
                    color: var(--text);
                    border-color: var(--primary);
                }
                .pres-btn-active {
                    color: var(--primary);
                    border-color: color-mix(in srgb, var(--primary) 40%, var(--border));
                    background: color-mix(in srgb, var(--primary) 8%, var(--surface-2));
                }
                .pres-btn-counter {
                    font-variant-numeric: tabular-nums;
                    min-width: 2rem;
                }
                .pres-panel {
                    position: fixed;
                    top: calc(var(--chrome-height) + 0.5rem);
                    right: 1.25rem;
                    width: 240px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    z-index: 200;
                    display: flex;
                    flex-direction: column;
                    gap: 0.875rem;
                    padding: 1rem;
                    animation: presIn 0.18s cubic-bezier(0.16,1,0.3,1) both;
                }
                @keyframes presIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .pres-panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .pres-panel-title {
                    font-size: 0.8125rem;
                    font-weight: 600;
                    color: var(--text);
                }
                .pres-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--muted);
                    font-size: 0.75rem;
                    width: 1.5rem;
                    height: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.12s, color 0.12s;
                }
                .pres-close:hover { background: var(--surface-2); color: var(--text); }
                .pres-durations {
                    display: flex;
                    gap: 0.25rem;
                    background: var(--surface-2);
                    border-radius: var(--radius-sm);
                    padding: 0.2rem;
                }
                .pres-dur-btn {
                    flex: 1;
                    padding: 0.3rem 0;
                    border-radius: calc(var(--radius-sm) - 2px);
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.12s, color 0.12s;
                }
                .pres-dur-btn:hover { color: var(--text); }
                .pres-dur-btn.active {
                    background: var(--surface);
                    color: var(--primary);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                }
                .pres-progress-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                }
                .pres-progress-track {
                    height: 3px;
                    background: var(--surface-2);
                    border-radius: 99px;
                    overflow: hidden;
                }
                .pres-progress-fill {
                    height: 100%;
                    background: var(--primary);
                    border-radius: 99px;
                    transition: width 1s linear;
                }
                .pres-progress-label {
                    font-size: 0.6875rem;
                    color: var(--muted);
                    text-transform: capitalize;
                    font-variant-numeric: tabular-nums;
                }
                .pres-actions {
                    display: flex;
                    gap: 0.375rem;
                }
                .pres-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.4rem 0.75rem;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: var(--surface-2);
                    color: var(--text-secondary);
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.12s, color 0.12s, border-color 0.12s;
                    white-space: nowrap;
                }
                .pres-action-play {
                    background: var(--primary);
                    border-color: var(--primary);
                    color: white;
                    flex: 1;
                    justify-content: center;
                }
                .pres-action-play:hover { opacity: 0.88; }
                .pres-action-pause {
                    border-color: color-mix(in srgb, var(--primary) 40%, var(--border));
                    color: var(--primary);
                    background: color-mix(in srgb, var(--primary) 10%, var(--surface-2));
                }
                .pres-action-pause:hover { background: color-mix(in srgb, var(--primary) 18%, var(--surface-2)); }
                .pres-action-skip:hover { color: var(--text); border-color: var(--text-secondary); }
                .pres-action-stop { color: var(--red); }
                .pres-action-stop:hover { border-color: var(--red); background: color-mix(in srgb, var(--red) 8%, var(--surface-2)); }
            `}</style>
        </>
    )
}
