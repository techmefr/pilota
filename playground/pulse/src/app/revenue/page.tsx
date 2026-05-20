import Shell from '@/technical/Layout/Shell'
import { fetchRevenue, fetchContracts } from '@/functional/Revenue/fetchRevenue'

function formatK(n: number) {
    return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`
}

function formatEur(n: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = Math.min(100, Math.round((value / max) * 100))
    return (
        <div className="rev-bar-wrap">
            <div className="rev-bar-track">
                <div className="rev-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <span className="rev-bar-pct">{pct}%</span>
        </div>
    )
}

export default async function RevenuePage() {
    const [revenue, contracts] = await Promise.all([fetchRevenue(), fetchContracts()])
    const monthPct = Math.round((revenue.amount / revenue.target) * 100)

    return (
        <Shell title="Money Maker" subtitle={`${revenue.period} — objectif ${formatEur(revenue.target)}`}>
            <div className="rev-layout">
                <section className="rev-section">
                    <h2 className="rev-section-title">Chiffre d'affaires</h2>
                    <div className="rev-cards">
                        <div className="rev-card">
                            <p className="rev-card-label">{revenue.period}</p>
                            <p className="rev-card-amount">{formatEur(revenue.amount)}</p>
                            <p className="rev-card-target">sur {formatEur(revenue.target)}</p>
                            <ProgressBar value={revenue.amount} max={revenue.target} color={monthPct >= 90 ? 'var(--green)' : monthPct >= 70 ? 'var(--orange)' : 'var(--red)'} />
                        </div>
                        <div className="rev-card">
                            <p className="rev-card-label">Cumul annuel</p>
                            <p className="rev-card-amount">{formatEur(revenue.annual_cumul)}</p>
                            <p className="rev-card-target">sur {formatEur(revenue.annual_target)}</p>
                            <ProgressBar value={revenue.annual_cumul} max={revenue.annual_target} color="var(--primary)" />
                        </div>
                    </div>
                </section>

                <section className="rev-section">
                    <h2 className="rev-section-title">Quête des contrats</h2>
                    <div className="rev-contracts">
                        {contracts.map(c => {
                            const pct = Math.round((c.count / c.target) * 100)
                            const color = c.type === 'franchise' ? 'var(--primary)' : 'var(--green)'
                            return (
                                <div key={c.id} className="rev-contract-row">
                                    <div className="rev-contract-header">
                                        <span className="rev-contract-type" style={{ color }}>{c.type === 'franchise' ? 'Franchise' : 'Propre'}</span>
                                        <span className="rev-contract-count">{c.count}/{c.target} contrats</span>
                                        <span className="rev-contract-value">{formatK(c.value_k)}k €</span>
                                    </div>
                                    <div className="rev-bar-track">
                                        <div className="rev-bar-fill" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

            <style>{`
                .rev-layout { display: flex; flex-direction: column; gap: 2rem; max-width: 720px; }
                .rev-section-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 0.875rem; }
                .rev-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .rev-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
                .rev-card-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
                .rev-card-amount { font-size: 2rem; font-weight: 800; color: var(--text); font-variant-numeric: tabular-nums; line-height: 1.1; margin-top: 0.25rem; }
                .rev-card-target { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.5rem; }
                .rev-bar-wrap { display: flex; align-items: center; gap: 0.625rem; }
                .rev-bar-track { flex: 1; height: 5px; background: var(--surface-2); border-radius: 99px; overflow: hidden; }
                .rev-bar-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
                .rev-bar-pct { font-size: 0.6875rem; font-weight: 700; color: var(--muted); min-width: 2.5rem; }
                .rev-contracts { display: flex; flex-direction: column; gap: 1rem; }
                .rev-contract-row { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 0.625rem; }
                .rev-contract-header { display: flex; align-items: center; gap: 1rem; }
                .rev-contract-type { font-size: 0.875rem; font-weight: 700; flex: 1; }
                .rev-contract-count { font-size: 0.8125rem; color: var(--text-secondary); font-variant-numeric: tabular-nums; }
                .rev-contract-value { font-size: 0.875rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
            `}</style>
        </Shell>
    )
}
