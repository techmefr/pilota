import { Rocket, Ticket } from 'lucide-react'
import type { Delivery } from '../fetchDeliveries'

interface IProps {
    delivery: Delivery
}

function ProgressBar({ resolved, total }: { resolved: number; total: number }) {
    const pct = total === 0 ? 0 : Math.round((resolved / total) * 100)
    const isDone = resolved === total
    return (
        <div className="del-progress">
            <div className="del-progress-track">
                <div
                    className="del-progress-fill"
                    style={{ width: `${pct}%`, background: isDone ? 'var(--green)' : 'var(--primary)' }}
                />
            </div>
            <span className="del-progress-label">
                {resolved}/{total} tickets
            </span>
        </div>
    )
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function DeliveryRow({ delivery }: IProps) {
    const isDone = delivery.tickets_resolved === delivery.tickets_total

    return (
        <article className="del-row">
            <div className="del-row-left">
                <div className="del-icon" style={{ color: isDone ? 'var(--green)' : 'var(--primary)' }}>
                    <Rocket size={14} />
                </div>
                <div>
                    <div className="del-name">
                        {delivery.project}
                        <span className="del-version">{delivery.version}</span>
                    </div>
                    {delivery.notes && <p className="del-notes">{delivery.notes}</p>}
                </div>
            </div>
            <div className="del-row-right">
                <span className="del-date">{formatDate(delivery.date)}</span>
                <ProgressBar resolved={delivery.tickets_resolved} total={delivery.tickets_total} />
            </div>

            <style>{`
                .del-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 0.875rem 1rem;
                    flex-wrap: wrap;
                }
                .del-row-left {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.625rem;
                    flex: 1;
                    min-width: 0;
                }
                .del-icon {
                    margin-top: 0.125rem;
                    flex-shrink: 0;
                }
                .del-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .del-version {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: var(--muted);
                    font-variant-numeric: tabular-nums;
                }
                .del-notes {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-top: 0.2rem;
                }
                .del-row-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.375rem;
                    min-width: 160px;
                }
                .del-date {
                    font-size: 0.75rem;
                    color: var(--muted);
                }
                .del-progress {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    width: 100%;
                }
                .del-progress-track {
                    height: 4px;
                    background: var(--surface-2);
                    border-radius: 99px;
                    overflow: hidden;
                    width: 100%;
                }
                .del-progress-fill {
                    height: 100%;
                    border-radius: 99px;
                    transition: width 0.4s ease;
                }
                .del-progress-label {
                    font-size: 0.6875rem;
                    color: var(--muted);
                    font-variant-numeric: tabular-nums;
                    text-align: right;
                }
            `}</style>
        </article>
    )
}
