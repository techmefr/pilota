import { useState, useEffect } from 'react'
import { useTranslate } from '../../../technical/Tolgee/useTranslate'
import type { Translations } from '../../../technical/I18n'
import type { Assignment } from '../../../technical/Sdk/resources'

interface IProps {
    inventory: Assignment[]
}

function statusBadge(status: Assignment['status'], t: Translations) {
    if (status === 'active') return <span className="badge badge-ok">{t.status_active}</span>
    if (status === 'repair') return <span className="badge badge-warning">{t.status_repair}</span>
    return <span className="badge badge-neutral">{t.status_returned}</span>
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function InventoryPage({ inventory }: IProps) {
    const t = useTranslate()
    const [search, setSearch] = useState('')
    const [teamFilter, setTeamFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const teams = [...new Set(inventory.map(a => a.team))].sort()

    const filtered = inventory.filter(a => {
        const q = search.toLowerCase()
        const matchSearch = q === '' ||
            a.employee.toLowerCase().includes(q) ||
            a.model.toLowerCase().includes(q) ||
            a.serial.toLowerCase().includes(q) ||
            a.team.toLowerCase().includes(q)
        const matchTeam = teamFilter === null || a.team === teamFilter
        const matchStatus = statusFilter === null || a.status === statusFilter
        return matchSearch && matchTeam && matchStatus
    })

    return (
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                {t.inventory_sub}
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
                        <button className={`filter-pill${teamFilter === null ? ' active' : ''}`} onClick={() => setTeamFilter(null)}>
                            {t.all_teams}
                        </button>
                        {teams.map(team => (
                            <button
                                key={team}
                                className={`filter-pill${teamFilter === team ? ' active' : ''}`}
                                onClick={() => setTeamFilter(team)}
                            >
                                {team}
                            </button>
                        ))}
                    </div>
                    <div className="filter-pills">
                        <button className={`filter-pill${statusFilter === null ? ' active' : ''}`} onClick={() => setStatusFilter(null)}>
                            {t.all_statuses}
                        </button>
                        <button className={`filter-pill${statusFilter === 'active' ? ' active' : ''}`} onClick={() => setStatusFilter('active')}>
                            {t.status_active}
                        </button>
                        <button className={`filter-pill${statusFilter === 'repair' ? ' active' : ''}`} onClick={() => setStatusFilter('repair')}>
                            {t.status_repair}
                        </button>
                        <button className={`filter-pill${statusFilter === 'returned' ? ' active' : ''}`} onClick={() => setStatusFilter('returned')}>
                            {t.status_returned}
                        </button>
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t.col_employee}</th>
                            <th>{t.col_team}</th>
                            <th>{t.col_device}</th>
                            <th>{t.col_serial}</th>
                            <th>{t.col_assigned}</th>
                            <th>{t.col_status}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="empty-state">{t.no_results}</td></tr>
                        )}
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td>
                                    <div className="cell-primary">{a.employee}</div>
                                    <div className="cell-sub">{a.email}</div>
                                </td>
                                <td>
                                    <div className="cell-primary">{a.team}</div>
                                    <div className="cell-sub">{a.department}</div>
                                </td>
                                <td className="cell-primary">{a.model}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{a.serial}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{formatDate(a.assigned_at)}</td>
                                <td>{statusBadge(a.status, t)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
