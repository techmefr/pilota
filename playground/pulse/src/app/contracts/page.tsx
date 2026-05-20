import Shell from '@/technical/Layout/Shell'
import { fetchContracts } from '@/functional/Revenue/fetchRevenue'
import { Trophy, TrendingUp, Target } from 'lucide-react'

function formatK(n: number) {
    return `${n}k €`
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = Math.min(100, Math.round((value / max) * 100))
    return (
        <div className="ct-bar-wrap">
            <div className="ct-bar-track">
                <div className="ct-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="ct-bar-pct">{pct}%</span>
        </div>
    )
}

export default async function ContractsPage() {
    const contracts = await fetchContracts()
    const totalCount  = contracts.reduce((s, c) => s + c.count, 0)
    const totalTarget = contracts.reduce((s, c) => s + c.target, 0)
    const totalValue  = contracts.reduce((s, c) => s + c.value_k, 0)

    return (
        <Shell
            title="Quête des contrats"
            subtitle={`${totalCount}/${totalTarget} signés · ${formatK(totalValue)} engagés`}
        >
            <div className="ct-layout">
                <div className="ct-cards">
                    {contracts.map(c => {
                        const color = c.type === 'franchise' ? 'var(--primary)' : 'var(--green)'
                        const label = c.type === 'franchise' ? 'Franchise' : 'En propre'
                        const pct = Math.min(100, Math.round((c.count / c.target) * 100))

                        return (
                            <div key={c.id} className="ct-card">
                                <div className="ct-card-top">
                                    <div className="ct-type-tag" style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                                        <Trophy size={12} />
                                        {label}
                                    </div>
                                    <span className="ct-pct-badge" style={{ color }}>{pct}%</span>
                                </div>

                                <div className="ct-count-row">
                                    <span className="ct-count-big" style={{ color }}>{c.count}</span>
                                    <span className="ct-count-sep">/{c.target}</span>
                                    <span className="ct-count-unit">contrats</span>
                                </div>

                                <ProgressBar value={c.count} max={c.target} color={color} />

                                <div className="ct-value-row">
                                    <TrendingUp size={13} style={{ color }} />
                                    <span>{formatK(c.value_k)} engagés</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="ct-total-card">
                    <div className="ct-total-header">
                        <Target size={14} />
                        <span>Total portefeuille</span>
                    </div>
                    <div className="ct-total-row">
                        <div className="ct-total-count">
                            <span className="ct-total-big">{totalCount}</span>
                            <span className="ct-total-sep">/{totalTarget}</span>
                            <span className="ct-total-unit">contrats</span>
                        </div>
                        <span className="ct-total-value">{formatK(totalValue)}</span>
                    </div>
                    <ProgressBar value={totalCount} max={totalTarget} color="var(--primary)" />
                </div>
            </div>

            <style>{`
                .ct-layout { display: flex; flex-direction: column; gap: 1.5rem; max-width: 600px; }
                .ct-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .ct-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.875rem; }
                .ct-card-top { display: flex; align-items: center; justify-content: space-between; }
                .ct-type-tag { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.625rem; border-radius: 99px; }
                .ct-pct-badge { font-size: 1.25rem; font-weight: 800; font-variant-numeric: tabular-nums; }
                .ct-count-row { display: flex; align-items: baseline; gap: 0.25rem; }
                .ct-count-big { font-size: 2.5rem; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
                .ct-count-sep { font-size: 1.25rem; font-weight: 700; color: var(--text-secondary); }
                .ct-count-unit { font-size: 0.8125rem; color: var(--muted); margin-left: 0.25rem; }
                .ct-value-row { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: var(--text-secondary); }
                .ct-bar-wrap { display: flex; align-items: center; gap: 0.625rem; }
                .ct-bar-track { flex: 1; height: 6px; background: var(--surface-2); border-radius: 99px; overflow: hidden; }
                .ct-bar-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
                .ct-bar-pct { font-size: 0.6875rem; font-weight: 700; color: var(--muted); min-width: 2.25rem; }
                .ct-total-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.875rem; }
                .ct-total-header { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
                .ct-total-row { display: flex; align-items: baseline; justify-content: space-between; }
                .ct-total-count { display: flex; align-items: baseline; gap: 0.25rem; }
                .ct-total-big { font-size: 2rem; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; line-height: 1; }
                .ct-total-sep { font-size: 1rem; font-weight: 700; color: var(--text-secondary); }
                .ct-total-unit { font-size: 0.75rem; color: var(--muted); margin-left: 0.2rem; }
                .ct-total-value { font-size: 1.125rem; font-weight: 700; color: var(--primary); }
            `}</style>
        </Shell>
    )
}
