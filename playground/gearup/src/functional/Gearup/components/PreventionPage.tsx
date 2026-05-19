import { useState, useEffect } from 'react'
import { ShieldAlert, Clock, Zap, Lock, Check } from 'lucide-react'
import { getTranslations } from '../../../technical/I18n'
import type { Lang } from '../../../technical/I18n'
import type { Alert } from '../../../technical/Sdk/resources'

interface IProps {
    alerts: Alert[]
}

function typeIcon(type: Alert['type']) {
    if (type === 'warranty') return <Clock size={14} />
    if (type === 'performance') return <Zap size={14} />
    if (type === 'security') return <Lock size={14} />
    return <ShieldAlert size={14} />
}

function severityBadge(severity: Alert['severity'], t: ReturnType<typeof getTranslations>) {
    if (severity === 'critical') return <span className="badge badge-critical">Critique</span>
    if (severity === 'warning') return <span className="badge badge-warning">Avertissement</span>
    return <span className="badge badge-info">Info</span>
}

function alertIconClass(severity: Alert['severity']) {
    if (severity === 'critical') return 'alert-icon alert-icon-critical'
    if (severity === 'warning') return 'alert-icon alert-icon-warning'
    return 'alert-icon alert-icon-info'
}

function typeLabel(type: Alert['type']) {
    if (type === 'warranty') return 'Garantie'
    if (type === 'performance') return 'Performance'
    if (type === 'security') return 'Sécurité'
    return 'Ancienneté'
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PreventionPage({ alerts: initialAlerts }: IProps) {
    const [lang, setLang] = useState<Lang>('fr')
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
    const [severityFilter, setSeverityFilter] = useState<string | null>(null)
    const [typeFilter, setTypeFilter] = useState<string | null>(null)
    const [showResolved, setShowResolved] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('gearup-lang') as Lang | null
        if (saved) setLang(saved)
        const handler = (e: Event) => setLang((e as CustomEvent<Lang>).detail)
        window.addEventListener('gearup-lang-change', handler)
        return () => window.removeEventListener('gearup-lang-change', handler)
    }, [])

    const t = getTranslations(lang)

    const filtered = alerts
        .filter(a => showResolved || a.status !== 'resolved')
        .filter(a => severityFilter === null || a.severity === severityFilter)
        .filter(a => typeFilter === null || a.type === typeFilter)
        .sort((a, b) => {
            const sOrder = { critical: 0, warning: 1, info: 2 }
            return sOrder[a.severity] - sOrder[b.severity]
        })

    function acknowledge(id: number) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a))
    }

    const critCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length
    const warnCount = alerts.filter(a => a.severity === 'warning' && a.status === 'active').length

    return (
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                {t.prevention_sub}
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {critCount > 0 && (
                    <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red)', borderRadius: 'var(--radius)', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldAlert size={18} style={{ color: 'var(--red)', flexShrink: 0 }} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--red)' }}>{critCount} alerte{critCount > 1 ? 's' : ''} critique{critCount > 1 ? 's' : ''}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Action immédiate requise</div>
                        </div>
                    </div>
                )}
                {warnCount > 0 && (
                    <div style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber)', borderRadius: 'var(--radius)', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Clock size={18} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--amber)' }}>{warnCount} avertissement{warnCount > 1 ? 's' : ''}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>À planifier dans les 30 jours</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="table-toolbar" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', borderBottom: 'none', marginBottom: 0 }}>
                <div className="filter-pills">
                    <button className={`filter-pill${severityFilter === null ? ' active' : ''}`} onClick={() => setSeverityFilter(null)}>Toutes</button>
                    <button className={`filter-pill${severityFilter === 'critical' ? ' active' : ''}`} onClick={() => setSeverityFilter('critical')}>Critiques</button>
                    <button className={`filter-pill${severityFilter === 'warning' ? ' active' : ''}`} onClick={() => setSeverityFilter('warning')}>Avertissements</button>
                    <button className={`filter-pill${severityFilter === 'info' ? ' active' : ''}`} onClick={() => setSeverityFilter('info')}>Info</button>
                </div>
                <div className="filter-pills">
                    <button className={`filter-pill${typeFilter === null ? ' active' : ''}`} onClick={() => setTypeFilter(null)}>{t.all_types}</button>
                    <button className={`filter-pill${typeFilter === 'warranty' ? ' active' : ''}`} onClick={() => setTypeFilter('warranty')}>Garantie</button>
                    <button className={`filter-pill${typeFilter === 'age' ? ' active' : ''}`} onClick={() => setTypeFilter('age')}>Ancienneté</button>
                    <button className={`filter-pill${typeFilter === 'performance' ? ' active' : ''}`} onClick={() => setTypeFilter('performance')}>Performance</button>
                    <button className={`filter-pill${typeFilter === 'security' ? ' active' : ''}`} onClick={() => setTypeFilter('security')}>Sécurité</button>
                </div>
                <button
                    className={`filter-pill${showResolved ? ' active' : ''}`}
                    style={{ marginLeft: 'auto' }}
                    onClick={() => setShowResolved(v => !v)}
                >
                    Afficher traités
                </button>
            </div>

            <div className="alert-list">
                {filtered.length === 0 && (
                    <div className="empty-state" style={{ background: 'var(--surface)' }}>
                        {t.no_results}
                    </div>
                )}
                {filtered.map(alert => (
                    <div key={alert.id} className="alert-row">
                        <div className={alertIconClass(alert.severity)}>
                            {typeIcon(alert.type)}
                        </div>
                        <div className="alert-content">
                            <div className="alert-title">{alert.employee} · {alert.device}</div>
                            <div className="alert-desc">{alert.description}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{alert.serial}</span>
                            <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{typeLabel(alert.type)}</span>
                        </div>
                        {severityBadge(alert.severity, t)}
                        <div className="alert-due">{formatDate(alert.due_date)}</div>
                        {alert.status === 'active' ? (
                            <button className="btn btn-ghost" style={{ padding: '0.25rem 0.625rem', fontSize: 'var(--text-xs)' }} onClick={() => acknowledge(alert.id)}>
                                <Check size={12} />
                                {t.acknowledge}
                            </button>
                        ) : (
                            <span className="badge badge-neutral">{t.status_acknowledged}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
