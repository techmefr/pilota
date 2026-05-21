import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { useTranslate } from '../../../technical/Tolgee/useTranslate'
import type { Translations } from '../../../technical/I18n'
import type { Repair } from '../../../technical/Sdk/resources'

interface IProps {
    repairs: Repair[]
}

function statusBadge(status: Repair['status'], t: Translations) {
    if (status === 'open') return <span className="badge badge-critical">{t.status_open}</span>
    if (status === 'in_progress') return <span className="badge badge-warning">{t.status_in_progress}</span>
    if (status === 'waiting_parts') return <span className="badge badge-info">{t.status_waiting_parts}</span>
    return <span className="badge badge-neutral">{t.status_closed}</span>
}

function formatDate(d: string | null) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

type NewRepairForm = {
    device: string
    employee: string
    issue: string
    technician: string
}

const EMPTY_FORM: NewRepairForm = { device: '', employee: '', issue: '', technician: '' }

export default function RepairsPage({ repairs: initialRepairs }: IProps) {
    const t = useTranslate()
    const [repairs, setRepairs] = useState<Repair[]>(initialRepairs)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form, setForm] = useState<NewRepairForm>(EMPTY_FORM)

    const filtered = repairs.filter(r => {
        const q = search.toLowerCase()
        const matchSearch = q === '' ||
            r.ticket.toLowerCase().includes(q) ||
            r.employee.toLowerCase().includes(q) ||
            r.issue.toLowerCase().includes(q)
        const matchStatus = statusFilter === null || r.status === statusFilter
        return matchSearch && matchStatus
    })

    function submitRepair() {
        if (!form.device || !form.employee || !form.issue) return
        const newRepair: Repair = {
            id: repairs.length + 1,
            ticket: `REP-2025-${String(repairs.length + 20).padStart(3, '0')}`,
            employee: form.employee,
            team: 'À définir',
            device: form.device,
            serial: 'TBD',
            issue: form.issue,
            status: 'open',
            technician: form.technician || null,
            opened_at: new Date().toISOString().split('T')[0] ?? '',
            closed_at: null,
            parts: [],
        }
        setRepairs(prev => [newRepair, ...prev])
        setForm(EMPTY_FORM)
        setIsModalOpen(false)
    }

    return (
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                {t.repairs_sub}
            </p>

            <div className="table-wrap">
                <div className="table-toolbar">
                    <input
                        className="search-input"
                        placeholder={t.search}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <div className="filter-pills">
                        {([null, 'open', 'in_progress', 'waiting_parts', 'closed'] as const).map(s => (
                            <button
                                key={s ?? 'all'}
                                className={`filter-pill${statusFilter === s ? ' active' : ''}`}
                                onClick={() => setStatusFilter(s)}
                            >
                                {s === null ? t.all_statuses
                                    : s === 'open' ? t.status_open
                                    : s === 'in_progress' ? t.status_in_progress
                                    : s === 'waiting_parts' ? t.status_waiting_parts
                                    : t.status_closed}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setIsModalOpen(true)}>
                        <Plus size={14} />
                        {t.new_repair}
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t.col_ticket}</th>
                            <th>{t.col_employee}</th>
                            <th>{t.col_device}</th>
                            <th>{t.col_issue}</th>
                            <th>{t.col_status}</th>
                            <th>{t.col_technician}</th>
                            <th>{t.col_opened}</th>
                            <th>{t.col_closed}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="empty-state">{t.no_results}</td></tr>
                        )}
                        {filtered.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {r.ticket}
                                </td>
                                <td>
                                    <div className="cell-primary">{r.employee}</div>
                                    <div className="cell-sub">{r.team}</div>
                                </td>
                                <td>
                                    <div className="cell-primary">{r.device}</div>
                                    <div className="cell-sub" style={{ fontFamily: 'monospace' }}>{r.serial}</div>
                                </td>
                                <td style={{ maxWidth: '220px' }}>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {r.issue}
                                    </div>
                                    {r.parts.length > 0 && (
                                        <div className="cell-sub">{r.parts.join(', ')}</div>
                                    )}
                                </td>
                                <td>{statusBadge(r.status, t)}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                                    {r.technician ?? '—'}
                                </td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>{formatDate(r.opened_at)}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>{formatDate(r.closed_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{t.new_repair}</span>
                            <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={14} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">{t.repair_device}</label>
                                    <input className="form-input" value={form.device} onChange={e => setForm(f => ({ ...f, device: e.target.value }))} placeholder="HP EliteBook 840 G10" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t.repair_employee}</label>
                                    <input className="form-input" value={form.employee} onChange={e => setForm(f => ({ ...f, employee: e.target.value }))} placeholder="Prénom Nom" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t.repair_issue}</label>
                                <textarea className="form-textarea" value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} placeholder="Décrivez le problème rencontré…" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t.repair_technician}</label>
                                <input className="form-input" value={form.technician} onChange={e => setForm(f => ({ ...f, technician: e.target.value }))} placeholder="Optionnel" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>{t.cancel}</button>
                            <button className="btn btn-primary" onClick={submitRepair}>{t.confirm}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
