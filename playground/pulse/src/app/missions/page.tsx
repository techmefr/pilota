import Shell from '@/technical/Layout/Shell'
import { fetchMissions } from '@/functional/Missions/fetchMissions'
import type { Mission } from '@/functional/Missions/fetchMissions'
import { User } from 'lucide-react'

const COLUMNS: { key: Mission['status']; label: string; color: string }[] = [
    { key: 'todo',        label: 'À faire',    color: 'var(--text-secondary)' },
    { key: 'in_progress', label: 'En cours',   color: 'var(--primary)' },
    { key: 'blocked',     label: 'Bloqué',     color: 'var(--red)' },
    { key: 'done',        label: 'Terminé',    color: 'var(--green)' },
]

const CATEGORY_LABELS: Record<Mission['category'], string> = {
    opco:               'OPCO',
    compliance:         'Conformité',
    project_management: 'Chefferie',
    features:           'Features',
}

function MissionCard({ mission }: { mission: Mission }) {
    return (
        <div className="mc">
            <div className="mc-category">{CATEGORY_LABELS[mission.category]}</div>
            <p className="mc-title">{mission.title}</p>
            {mission.owner && (
                <div className="mc-owner">
                    <User size={10} />
                    <span>{mission.owner}</span>
                </div>
            )}
            {mission.due_date && (
                <div className="mc-due">
                    {new Date(mission.due_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
            )}
        </div>
    )
}

export default async function MissionsPage() {
    const missions = await fetchMissions()
    const inProgress = missions.filter(m => m.status === 'in_progress').length

    return (
        <Shell
            title="Missions"
            subtitle={`${missions.length} au total · ${inProgress} en cours`}
        >
            <div className="kanban">
                {COLUMNS.map(col => {
                    const cards = missions.filter(m => m.status === col.key)
                    return (
                        <div key={col.key} className="kanban-col">
                            <div className="kanban-col-header" style={{ color: col.color }}>
                                <span className="kanban-col-label">{col.label}</span>
                                <span className="kanban-col-count">{cards.length}</span>
                            </div>
                            <div className="kanban-cards">
                                {cards.map(m => <MissionCard key={m.id} mission={m} />)}
                                {cards.length === 0 && (
                                    <div className="kanban-empty">—</div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <style>{`
                .kanban {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    align-items: start;
                }
                @media (max-width: 900px) {
                    .kanban { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 540px) {
                    .kanban { grid-template-columns: 1fr; }
                }
                .kanban-col {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .kanban-col-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 0.25rem 0.5rem;
                    border-bottom: 2px solid currentColor;
                }
                .kanban-col-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }
                .kanban-col-count {
                    font-size: 0.75rem;
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    opacity: 0.7;
                }
                .kanban-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .kanban-empty {
                    text-align: center;
                    color: var(--border);
                    font-size: 1.25rem;
                    padding: 1rem;
                }
                .mc {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    padding: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;
                }
                .mc-category {
                    font-size: 0.625rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--muted);
                }
                .mc-title {
                    font-size: 0.8125rem;
                    font-weight: 500;
                    color: var(--text);
                    line-height: 1.4;
                }
                .mc-owner {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.6875rem;
                    color: var(--muted);
                }
                .mc-due {
                    font-size: 0.6875rem;
                    color: var(--text-secondary);
                }
            `}</style>
        </Shell>
    )
}
