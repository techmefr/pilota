import { CheckCircle2, AlertCircle, Target } from 'lucide-react'
import type { Objective } from '../fetchObjectives'

interface IProps {
    objective: Objective
    dim?: boolean
}

function Avatar({ person }: { person: string }) {
    const initials = person.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const hue = [...person].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
    return (
        <div
            className="oc-avatar"
            style={{ background: `oklch(45% 0.18 ${hue})`, color: 'white' }}
            aria-hidden="true"
        >
            {initials}
        </div>
    )
}

export default function ObjectiveCard({ objective, dim }: IProps) {
    return (
        <article className={`oc${dim ? ' oc-dim' : ''}`}>
            <div className="oc-header">
                <Avatar person={objective.person} />
                <span className="oc-person">{objective.person}</span>
            </div>

            <div className="oc-focus">
                <Target size={13} className="oc-focus-icon" />
                <p>{objective.focus}</p>
            </div>

            {objective.wins.length > 0 && (
                <ul className="oc-list oc-wins">
                    {objective.wins.map((w, i) => (
                        <li key={i} className="oc-item">
                            <CheckCircle2 size={12} />
                            <span>{w}</span>
                        </li>
                    ))}
                </ul>
            )}

            {objective.blockers.length > 0 && (
                <ul className="oc-list oc-blockers">
                    {objective.blockers.map((b, i) => (
                        <li key={i} className="oc-item">
                            <AlertCircle size={12} />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            )}

            <style>{`
                .oc {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .oc-dim {
                    opacity: 0.65;
                }
                .oc-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .oc-avatar {
                    width: 1.875rem;
                    height: 1.875rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .oc-person {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text);
                }
                .oc-focus {
                    display: flex;
                    gap: 0.5rem;
                    align-items: flex-start;
                    color: var(--text-secondary);
                    font-size: 0.8125rem;
                    line-height: 1.45;
                }
                .oc-focus-icon {
                    flex-shrink: 0;
                    margin-top: 0.125rem;
                    color: var(--primary);
                }
                .oc-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.3rem;
                    list-style: none;
                }
                .oc-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.375rem;
                    font-size: 0.75rem;
                    line-height: 1.4;
                }
                .oc-wins .oc-item { color: var(--green); }
                .oc-wins .oc-item span { color: var(--text-secondary); }
                .oc-blockers .oc-item { color: var(--red); }
                .oc-blockers .oc-item span { color: var(--text-secondary); }
            `}</style>
        </article>
    )
}
