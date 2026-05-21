import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { useTranslate } from '../../../technical/Tolgee/useTranslate'
import type { Translations } from '../../../technical/I18n'
import type { Order } from '../../../technical/Sdk/resources'

interface IProps {
    orders: Order[]
}

function statusBadge(status: Order['status'], t: Translations) {
    if (status === 'pending') return <span className="badge badge-neutral">{t.status_pending}</span>
    if (status === 'approved') return <span className="badge badge-info">{t.status_approved}</span>
    if (status === 'ordered') return <span className="badge badge-warning">{t.status_ordered}</span>
    return <span className="badge badge-ok">{t.status_delivered}</span>
}

function typeBadge(type: Order['type'], t: Translations) {
    if (type === 'hardware') return <span className="badge badge-info">{t.order_type_hardware}</span>
    if (type === 'parts') return <span className="badge badge-warning">{t.order_type_parts}</span>
    return <span className="badge badge-neutral">{t.order_type_consumable}</span>
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

type NewOrderForm = {
    item: string
    type: Order['type']
    quantity: string
    reason: string
    requested_by: string
}

const EMPTY_FORM: NewOrderForm = { item: '', type: 'hardware', quantity: '1', reason: '', requested_by: '' }

export default function OrdersPage({ orders: initialOrders }: IProps) {
    const t = useTranslate()
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form, setForm] = useState<NewOrderForm>(EMPTY_FORM)

    const filtered = orders.filter(o => {
        const q = search.toLowerCase()
        const matchSearch = q === '' ||
            o.ref.toLowerCase().includes(q) ||
            o.item.toLowerCase().includes(q) ||
            o.requested_by.toLowerCase().includes(q)
        const matchStatus = statusFilter === null || o.status === statusFilter
        return matchSearch && matchStatus
    })

    function submitOrder() {
        if (!form.item || !form.reason || !form.requested_by) return
        const newOrder: Order = {
            id: orders.length + 1,
            ref: `CMD-2025-${String(orders.length + 50).padStart(3, '0')}`,
            type: form.type,
            item: form.item,
            quantity: parseInt(form.quantity, 10) || 1,
            reason: form.reason,
            requested_by: form.requested_by,
            status: 'pending',
            created_date: new Date().toISOString().split('T')[0] ?? '',
        }
        setOrders(prev => [newOrder, ...prev])
        setForm(EMPTY_FORM)
        setIsModalOpen(false)
    }

    return (
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                {t.orders_sub}
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
                        {([null, 'pending', 'approved', 'ordered', 'delivered'] as const).map(s => (
                            <button
                                key={s ?? 'all'}
                                className={`filter-pill${statusFilter === s ? ' active' : ''}`}
                                onClick={() => setStatusFilter(s)}
                            >
                                {s === null ? t.all_statuses
                                    : s === 'pending' ? t.status_pending
                                    : s === 'approved' ? t.status_approved
                                    : s === 'ordered' ? t.status_ordered
                                    : t.status_delivered}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setIsModalOpen(true)}>
                        <Plus size={14} />
                        {t.new_order}
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t.col_ref}</th>
                            <th>{t.col_item}</th>
                            <th style={{ textAlign: 'center' }}>{t.col_qty}</th>
                            <th>{t.order_type}</th>
                            <th>{t.col_status}</th>
                            <th>{t.col_requested}</th>
                            <th>{t.col_created}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} className="empty-state">{t.no_results}</td></tr>
                        )}
                        {filtered.map(o => (
                            <tr key={o.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {o.ref}
                                </td>
                                <td>
                                    <div className="cell-primary">{o.item}</div>
                                    <div className="cell-sub">{o.reason}</div>
                                </td>
                                <td style={{ textAlign: 'center', fontWeight: 700 }}>{o.quantity}</td>
                                <td>{typeBadge(o.type, t)}</td>
                                <td>{statusBadge(o.status, t)}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{o.requested_by}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>{formatDate(o.created_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
                    <div className="modal">
                        <div className="modal-header">
                            <span className="modal-title">{t.new_order}</span>
                            <button className="icon-btn" onClick={() => setIsModalOpen(false)}><X size={14} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">{t.order_item}</label>
                                <input className="form-input" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} placeholder="Ex: HP ZBook Power G10" />
                            </div>
                            <div className="form-grid-2">
                                <div className="form-group">
                                    <label className="form-label">{t.order_type}</label>
                                    <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Order['type'] }))}>
                                        <option value="hardware">{t.order_type_hardware}</option>
                                        <option value="parts">{t.order_type_parts}</option>
                                        <option value="consumable">{t.order_type_consumable}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">{t.order_qty}</label>
                                    <input className="form-input" type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t.order_reason}</label>
                                <textarea className="form-textarea" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="Justification de la demande…" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t.col_requested}</label>
                                <input className="form-input" value={form.requested_by} onChange={e => setForm(f => ({ ...f, requested_by: e.target.value }))} placeholder="Prénom Nom" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>{t.cancel}</button>
                            <button className="btn btn-primary" onClick={submitOrder}>{t.confirm}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
