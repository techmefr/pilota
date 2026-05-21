import { useState, useEffect } from 'react'
import { useTranslate } from '../../../technical/Tolgee/useTranslate'
import type { Translations } from '../../../technical/I18n'
import type { PcProfile } from '../../../technical/Sdk/resources'

interface IProps {
    profiles: PcProfile[]
    cycle: string
}

function tierBadge(tier: string, t: Translations) {
    if (tier === 'performance') return <span className="badge tier-perf">{t.perf}</span>
    if (tier === 'apple') return <span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>{t.apple}</span>
    return <span className="badge tier-std">{t.std}</span>
}

function stockClass(stock: number, total: number) {
    if (stock === 0) return 'stock-out'
    if (stock / total < 0.3) return 'stock-low'
    return 'stock-ok'
}

function toOrder(p: PcProfile) {
    return Math.max(0, p.total - p.stock)
}

export default function ProfilesPage({ profiles, cycle }: IProps) {
    const t = useTranslate()
    const [search, setSearch] = useState('')
    const [tierFilter, setTierFilter] = useState<string | null>(null)

    const filtered = profiles.filter(p => {
        const matchSearch = search === '' || p.role.toLowerCase().includes(search.toLowerCase()) || p.model_name.toLowerCase().includes(search.toLowerCase())
        const matchTier = tierFilter === null || p.model_tier === tierFilter
        return matchSearch && matchTier
    })

    const tiers = [...new Set(profiles.map(p => p.model_tier))]

    return (
        <div>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                {t.profiles_sub} {cycle}
            </p>

            <div className="table-toolbar" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', borderBottom: 'none' }}>
                <input
                    className="search-input"
                    placeholder={t.search}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="filter-pills">
                    <button
                        className={`filter-pill${tierFilter === null ? ' active' : ''}`}
                        onClick={() => setTierFilter(null)}
                    >
                        Tous
                    </button>
                    {tiers.map(tier => (
                        <button
                            key={tier}
                            className={`filter-pill${tierFilter === tier ? ' active' : ''}`}
                            onClick={() => setTierFilter(tier)}
                        >
                            {tier === 'performance' ? t.perf : tier === 'apple' ? t.apple : t.std}
                        </button>
                    ))}
                </div>
            </div>

            <div className="profile-grid">
                {filtered.length === 0 && (
                    <div className="empty-state">{t.no_results}</div>
                )}
                {filtered.map(p => (
                    <div key={p.id} className="profile-card">
                        <div className="profile-head">
                            <span className="profile-role">{p.role}</span>
                            {tierBadge(p.model_tier, t)}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {p.model_name}
                        </div>
                        <div className="spec-list">
                            <div className="spec-row"><span className="spec-key">CPU</span><span className="spec-val">{p.cpu}</span></div>
                            <div className="spec-row"><span className="spec-key">RAM</span><span className="spec-val">{p.ram}</span></div>
                            <div className="spec-row"><span className="spec-key">Stockage</span><span className="spec-val">{p.storage}</span></div>
                            <div className="spec-row"><span className="spec-key">GPU</span><span className="spec-val">{p.gpu}</span></div>
                            <div className="spec-row"><span className="spec-key">Écrans</span><span className="spec-val">{p.screens}× {p.screen_spec}</span></div>
                        </div>
                        <div className="profile-footer">
                            <span>{p.total} postes</span>
                            <span className={stockClass(p.stock, p.total)}>
                                {p.stock} en stock
                            </span>
                            {toOrder(p) > 0 && (
                                <span className="badge badge-warning">+{toOrder(p)} à commander</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
