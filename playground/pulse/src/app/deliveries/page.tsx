import Shell from '@/technical/Layout/Shell'
import DeliveryRow from '@/functional/Deliveries/components/DeliveryRow'
import { fetchDeliveries } from '@/functional/Deliveries/fetchDeliveries'

export default async function DeliveriesPage() {
    const deliveries = await fetchDeliveries()
    const done = deliveries.filter(d => d.tickets_resolved === d.tickets_total).length

    return (
        <Shell
            title="Livraisons"
            subtitle={`${deliveries.length} release${deliveries.length > 1 ? 's' : ''} · ${done} terminée${done > 1 ? 's' : ''}`}
        >
            <div className="del-list">
                {deliveries.length === 0 ? (
                    <p className="del-empty">Aucune livraison cette semaine.</p>
                ) : (
                    deliveries.map(d => <DeliveryRow key={d.id} delivery={d} />)
                )}
            </div>

            <style>{`
                .del-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.625rem;
                    max-width: 780px;
                }
                .del-empty {
                    font-size: 0.875rem;
                    color: var(--muted);
                    padding: 1.5rem;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                }
            `}</style>
        </Shell>
    )
}
