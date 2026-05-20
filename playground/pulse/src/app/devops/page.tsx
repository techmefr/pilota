import Shell from '@/technical/Layout/Shell'
import { fetchDevOpsNeeds } from '@/functional/DevOps/fetchDevOpsNeeds'
import { AlertTriangle, CheckCircle, Clock, ArrowUp } from 'lucide-react'

const PRIORITY = {
    critical: { label: 'Critique', color: 'var(--red)',     icon: AlertTriangle },
    high:     { label: 'Haute',    color: 'var(--orange)',  icon: ArrowUp },
    medium:   { label: 'Moyenne',  color: 'var(--yellow)',  icon: Clock },
    low:      { label: 'Basse',    color: 'var(--muted)',   icon: Clock },
}

const STATUS = {
    todo:        { label: 'À faire',    color: 'var(--text-secondary)' },
    in_progress: { label: 'En cours',   color: 'var(--primary)' },
    done:        { label: 'Terminé',    color: 'var(--green)' },
}

export default async function DevOpsPage() {
    const needs = await fetchDevOpsNeeds()
    const open = needs.filter(n => n.status !== 'done').length
    const critical = needs.filter(n => n.priority === 'critical' && n.status !== 'done').length

    return (
        <Shell
            title="Besoins DevOps"
            subtitle={`${open} ouverts${critical > 0 ? ` · ${critical} critique${critical > 1 ? 's' : ''}` : ''}`}
        >
            <div className="dv-list">
                {needs.map(need => {
                    const pri = PRIORITY[need.priority]
                    const sta = STATUS[need.status]
                    const Icon = pri.icon
                    const isDone = need.status === 'done'
                    return (
                        <div key={need.id} className={`dv-item${isDone ? ' dv-done' : ''}`}>
                            <div className="dv-left">
                                <Icon size={14} style={{ color: isDone ? 'var(--muted)' : pri.color, flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <div className="dv-title">{need.title}</div>
                                    {need.notes && <p className="dv-notes">{need.notes}</p>}
                                    {need.project && <span className="dv-project">{need.project}</span>}
                                </div>
                            </div>
                            <div className="dv-right">
                                <span className="dv-badge" style={{ color: isDone ? 'var(--muted)' : pri.color, background: `color-mix(in srgb, ${isDone ? 'var(--muted)' : pri.color} 10%, transparent)` }}>
                                    {pri.label}
                                </span>
                                <span className="dv-status" style={{ color: sta.color }}>
                                    {isDone && <CheckCircle size={11} />}
                                    {sta.label}
                                </span>
                                {need.owner && <span className="dv-owner">{need.owner}</span>}
                            </div>
                        </div>
                    )
                })}
            </div>

            <style>{`
                .dv-list { display: flex; flex-direction: column; gap: 0.5rem; max-width: 820px; }
                .dv-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.875rem 1rem; flex-wrap: wrap; }
                .dv-done { opacity: 0.55; }
                .dv-left { display: flex; gap: 0.625rem; flex: 1; min-width: 0; }
                .dv-title { font-size: 0.875rem; font-weight: 600; color: var(--text); }
                .dv-notes { font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem; line-height: 1.4; }
                .dv-project { display: inline-block; font-size: 0.6875rem; font-weight: 600; color: var(--muted); margin-top: 0.25rem; background: var(--surface-2); padding: 0.1rem 0.4rem; border-radius: 4px; }
                .dv-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; flex-wrap: wrap; }
                .dv-badge { font-size: 0.6875rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 99px; }
                .dv-status { font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.25rem; }
                .dv-owner { font-size: 0.75rem; color: var(--muted); }
            `}</style>
        </Shell>
    )
}
