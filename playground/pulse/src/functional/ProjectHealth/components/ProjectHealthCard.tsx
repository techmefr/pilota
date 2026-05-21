import { Bug, Rocket, Circle, AlertOctagon, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'
import type { Project } from '../fetchProjects'

const STATUS_CONFIG = {
    ok:       { label: 'OK',       color: 'var(--green)',  dim: 'color-mix(in srgb, var(--green) 12%, transparent)' },
    warning:  { label: 'Attention', color: 'var(--orange)', dim: 'color-mix(in srgb, var(--orange) 12%, transparent)' },
    critical: { label: 'Critique',  color: 'var(--red)',    dim: 'color-mix(in srgb, var(--red) 12%, transparent)' },
    inactive: { label: 'Inactif',   color: 'var(--muted)',  dim: 'color-mix(in srgb, var(--muted) 12%, transparent)' },
}

interface IProps {
    project: Project
}

export default function ProjectHealthCard({ project }: IProps) {
    const cfg = STATUS_CONFIG[project.status]
    const isCritical = project.status === 'critical'
    const isWarning = project.status === 'warning'

    return (
        <article
            className={clsx('phc', isCritical && 'phc-critical', isWarning && 'phc-warning')}
            style={{ '--status-color': cfg.color, '--status-dim': cfg.dim } as React.CSSProperties}
        >
            <div className="phc-header">
                {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="phc-name phc-name-link">
                        {project.name}
                        <ExternalLink size={11} className="phc-name-icon" />
                    </a>
                ) : (
                    <div className="phc-name">{project.name}</div>
                )}
                <span className="phc-badge">
                    <Circle size={6} fill="currentColor" strokeWidth={0} />
                    {cfg.label}
                </span>
            </div>

            <div className="phc-team">{project.team}</div>

            <div className="phc-metrics">
                <div className="phc-metric">
                    <Bug size={13} />
                    <span className={clsx('phc-metric-value', project.open_bugs > 5 && 'phc-metric-danger')}>
                        {project.open_bugs}
                    </span>
                    <span className="phc-metric-label">bugs</span>
                </div>
                {project.sentry_issues > 0 && (
                    <div className="phc-metric">
                        <AlertOctagon size={13} />
                        <span className={clsx('phc-metric-value', project.sentry_criticals > 0 && 'phc-metric-danger')}>
                            {project.sentry_issues}
                        </span>
                        <span className="phc-metric-label">
                            Sentry{project.sentry_criticals > 0 ? ` · ${project.sentry_criticals} crit.` : ''}
                        </span>
                    </div>
                )}
            </div>

            {project.deployments.length > 0 && (
                <div className="phc-deployments">
                    {project.deployments.map((d, i) => (
                        <div key={i} className="phc-deployment">
                            <Rocket size={11} />
                            <span>{d}</span>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .phc {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.625rem;
                    transition: border-color 0.15s;
                }
                .phc-warning {
                    border-color: color-mix(in srgb, var(--orange) 35%, var(--border));
                }
                .phc-critical {
                    border-color: color-mix(in srgb, var(--red) 55%, var(--border));
                    background: color-mix(in srgb, var(--red) 4%, var(--surface));
                }
                .phc-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                }
                .phc-name {
                    font-size: 0.9375rem;
                    font-weight: 700;
                    color: var(--text);
                }
                .phc-name-link {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    text-decoration: none;
                    color: var(--text);
                    transition: color 0.1s;
                }
                .phc-name-link:hover {
                    color: var(--primary);
                }
                .phc-name-icon {
                    opacity: 0.5;
                    flex-shrink: 0;
                }
                .phc-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    padding: 0.2rem 0.5rem;
                    border-radius: 99px;
                    background: var(--status-dim);
                    color: var(--status-color);
                    white-space: nowrap;
                }
                .phc-team {
                    font-size: 0.75rem;
                    color: var(--muted);
                }
                .phc-metrics {
                    display: flex;
                    gap: 0.75rem;
                }
                .phc-metric {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    color: var(--text-secondary);
                    font-size: 0.8125rem;
                }
                .phc-metric-value {
                    font-weight: 700;
                    color: var(--text);
                    font-variant-numeric: tabular-nums;
                }
                .phc-metric-danger {
                    color: var(--red);
                }
                .phc-metric-label {
                    color: var(--muted);
                }
                .phc-deployments {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    padding-top: 0.375rem;
                    border-top: 1px solid var(--border);
                }
                .phc-deployment {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
            `}</style>
        </article>
    )
}
