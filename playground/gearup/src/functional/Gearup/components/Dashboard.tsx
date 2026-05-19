import { useState, useEffect } from 'react'
import { AlertTriangle, Wrench, ShoppingCart, Package } from 'lucide-react'
import { getTranslations } from '../../../technical/I18n'
import type { Lang, Translations } from '../../../technical/I18n'
import type { PcProfile, Assignment, Repair, Order, Alert } from '../../../technical/Sdk/resources'

interface IProps {
    profiles: PcProfile[]
    inventory: Assignment[]
    repairs: Repair[]
    orders: Order[]
    alerts: Alert[]
}

function badgeClass(severity: Alert['severity']) {
    if (severity === 'critical') return 'badge badge-critical'
    if (severity === 'warning') return 'badge badge-warning'
    return 'badge badge-info'
}

function alertIconClass(severity: Alert['severity']) {
    if (severity === 'critical') return 'alert-icon alert-icon-critical'
    if (severity === 'warning') return 'alert-icon alert-icon-warning'
    return 'alert-icon alert-icon-info'
}

function activityDotColor(type: 'repair' | 'order' | 'alert') {
    if (type === 'repair') return 'var(--amber)'
    if (type === 'order') return 'var(--blue)'
    return 'var(--red)'
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function severityLabel(severity: Alert['severity'], t: Translations) {
    if (severity === 'critical') return t.status_open
    if (severity === 'warning') return 'Avertissement'
    return 'Info'
}

export default function Dashboard({ profiles, inventory, repairs, orders, alerts }: IProps) {
    const [lang, setLang] = useState<Lang>('fr')

    useEffect(() => {
        const saved = localStorage.getItem('gearup-lang') as Lang | null
        if (saved) setLang(saved)
        const handler = (e: Event) => setLang((e as CustomEvent<Lang>).detail)
        window.addEventListener('gearup-lang-change', handler)
        return () => window.removeEventListener('gearup-lang-change', handler)
    }, [])

    const t = getTranslations(lang)

    const totalDevices = inventory.length
    const activeRepairs = repairs.filter(r => r.status !== 'closed').length
    const activeOrders = orders.filter(o => o.status !== 'delivered').length
    const activeAlerts = alerts.filter(a => a.status === 'active').length
    const criticalAlerts = alerts.filter(a => a.status === 'active' && a.severity === 'critical')

    const recentActivity = [
        ...repairs.filter(r => r.status !== 'closed').slice(0, 3).map(r => ({
            type: 'repair' as const,
            text: `${r.ticket} · ${r.employee} · ${r.issue.slice(0, 50)}`,
            date: r.opened_at,
        })),
        ...orders.filter(o => o.status === 'pending').slice(0, 2).map(o => ({
            type: 'order' as const,
            text: `${o.ref} · ${o.item.slice(0, 50)}`,
            date: o.created_date,
        })),
    ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)

    return (
        <div>
            <div className="kpi-strip">
                <div className="kpi-cell">
                    <div className="kpi-label">{t.kpi_total}</div>
                    <div className="kpi-value">{totalDevices}</div>
                    <div className="kpi-sub">{profiles.length} {t.kpi_profiles}</div>
                </div>
                <div className="kpi-cell">
                    <div className="kpi-label">{t.kpi_repairs}</div>
                    <div className="kpi-value" style={{ color: activeRepairs > 0 ? 'var(--amber)' : 'var(--green)' }}>{activeRepairs}</div>
                    <div className="kpi-sub">{t.kpi_repairs_sub}</div>
                </div>
                <div className="kpi-cell">
                    <div className="kpi-label">{t.kpi_orders}</div>
                    <div className="kpi-value" style={{ color: 'var(--blue)' }}>{activeOrders}</div>
                    <div className="kpi-sub">{t.kpi_orders_sub}</div>
                </div>
                <div className="kpi-cell">
                    <div className="kpi-label">{t.kpi_alerts}</div>
                    <div className="kpi-value" style={{ color: activeAlerts > 0 ? 'var(--red)' : 'var(--green)' }}>{activeAlerts}</div>
                    <div className="kpi-sub">{t.kpi_alerts_sub}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                    <div className="section-header">
                        <span className="section-title">{t.critical_alerts}</span>
                        <AlertTriangle size={16} style={{ color: 'var(--red)' }} />
                    </div>
                    <div className="alert-list">
                        {criticalAlerts.length === 0 && (
                            <div className="empty-state" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                Aucune alerte critique
                            </div>
                        )}
                        {criticalAlerts.map(alert => (
                            <div key={alert.id} className="alert-row">
                                <div className={alertIconClass(alert.severity)}>
                                    <ShieldIcon size={14} />
                                </div>
                                <div className="alert-content">
                                    <div className="alert-title">{alert.employee} · {alert.device}</div>
                                    <div className="alert-desc">{alert.description}</div>
                                </div>
                                <span className={badgeClass(alert.severity)}>{severityLabel(alert.severity, t)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="section-header">
                        <span className="section-title">{t.recent_activity}</span>
                    </div>
                    <div className="table-wrap">
                        <div className="activity-list" style={{ padding: '0 1rem' }}>
                            {recentActivity.map((item, i) => (
                                <div key={i} className="activity-item">
                                    <div className="activity-dot" style={{ background: activityDotColor(item.type) }} />
                                    <div className="activity-text">{item.text}</div>
                                    <div className="activity-time">{formatDate(item.date)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShieldIcon({ size }: { size: number }) {
    return <AlertTriangle size={size} />
}
