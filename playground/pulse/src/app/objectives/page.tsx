import Shell from '@/technical/Layout/Shell'
import ObjectiveCard from '@/functional/Objectives/components/ObjectiveCard'
import { fetchObjectives, getCurrentWeek } from '@/functional/Objectives/fetchObjectives'

export default async function ObjectivesPage() {
    const { week, year } = getCurrentWeek()
    const prevWeek = week === 1 ? 52 : week - 1
    const prevYear = week === 1 ? year - 1 : year

    const [current, previous] = await Promise.all([
        fetchObjectives(week, year),
        fetchObjectives(prevWeek, prevYear),
    ])

    return (
        <Shell
            title="Objectifs"
            subtitle={`Semaine ${week} · ${current.length} membre${current.length > 1 ? 's' : ''}`}
        >
            <div className="obj-sections">
                <section>
                    <h2 className="obj-section-title">
                        <span className="obj-week-badge obj-week-current">S{week}</span>
                        Cette semaine
                    </h2>
                    <div className="obj-grid">
                        {current.length === 0 ? (
                            <p className="obj-empty">Aucun objectif enregistré pour cette semaine.</p>
                        ) : (
                            current.map(obj => (
                                <ObjectiveCard key={obj.id} objective={obj} />
                            ))
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="obj-section-title">
                        <span className="obj-week-badge">S{prevWeek}</span>
                        Semaine précédente
                    </h2>
                    <div className="obj-grid">
                        {previous.length === 0 ? (
                            <p className="obj-empty">Aucun objectif enregistré.</p>
                        ) : (
                            previous.map(obj => (
                                <ObjectiveCard key={obj.id} objective={obj} dim />
                            ))
                        )}
                    </div>
                </section>
            </div>

            <style>{`
                .obj-sections {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .obj-section-title {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    color: var(--muted);
                    margin-bottom: 0.875rem;
                }
                .obj-week-badge {
                    padding: 0.2rem 0.5rem;
                    border-radius: 99px;
                    font-size: 0.6875rem;
                    background: var(--surface-2);
                    color: var(--text-secondary);
                    border: 1px solid var(--border);
                }
                .obj-week-current {
                    background: color-mix(in srgb, var(--primary) 12%, transparent);
                    color: var(--primary);
                    border-color: color-mix(in srgb, var(--primary) 30%, transparent);
                }
                .obj-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                }
                .obj-empty {
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
