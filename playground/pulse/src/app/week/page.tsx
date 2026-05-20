import Shell from '@/technical/Layout/Shell'
import { fetchWeekInfo } from '@/functional/WeekInfo/fetchWeekInfo'
import { Calendar, Mic2, Star, Newspaper } from 'lucide-react'

const TYPE_CONFIG = {
    event:   { label: 'Event',   icon: Calendar, color: 'var(--primary)' },
    devtalk: { label: 'DevTalk', icon: Mic2,      color: 'var(--green)' },
    score:   { label: 'Score',   icon: Star,      color: 'var(--yellow)' },
    news:    { label: 'News',    icon: Newspaper,  color: 'var(--orange)' },
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default async function WeekPage() {
    const items = await fetchWeekInfo()
    const events = items.filter(i => i.type === 'event' || i.type === 'devtalk')
    const highlights = items.filter(i => i.type === 'score' || i.type === 'news')

    return (
        <Shell title="Infos semaine" subtitle="Semaine 21 — events, DevTalk, scores">
            <div className="wk-layout">
                <section>
                    <h2 className="wk-section-title">Agenda & DevTalks</h2>
                    <div className="wk-list">
                        {events.map(item => {
                            const cfg = TYPE_CONFIG[item.type]
                            const Icon = cfg.icon
                            return (
                                <div key={item.id} className="wk-item">
                                    <div className="wk-icon-wrap" style={{ color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 12%, transparent)` }}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="wk-item-body">
                                        <div className="wk-item-title">{item.title}</div>
                                        {item.detail && <p className="wk-item-detail">{item.detail}</p>}
                                        {item.date && <p className="wk-item-date">{formatDate(item.date)}</p>}
                                    </div>
                                    <span className="wk-type-badge" style={{ color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 10%, transparent)` }}>
                                        {cfg.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section>
                    <h2 className="wk-section-title">Scores & News</h2>
                    <div className="wk-list">
                        {highlights.map(item => {
                            const cfg = TYPE_CONFIG[item.type]
                            const Icon = cfg.icon
                            return (
                                <div key={item.id} className="wk-item">
                                    <div className="wk-icon-wrap" style={{ color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 12%, transparent)` }}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="wk-item-body">
                                        <div className="wk-item-title">{item.title}</div>
                                        {item.detail && <p className="wk-item-detail">{item.detail}</p>}
                                    </div>
                                    <span className="wk-type-badge" style={{ color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 10%, transparent)` }}>
                                        {cfg.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>

            <style>{`
                .wk-layout { display: flex; flex-direction: column; gap: 2rem; max-width: 720px; }
                .wk-section-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); margin-bottom: 0.75rem; }
                .wk-list { display: flex; flex-direction: column; gap: 0.5rem; }
                .wk-item { display: flex; align-items: flex-start; gap: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 0.875rem 1rem; }
                .wk-icon-wrap { width: 2rem; height: 2rem; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .wk-item-body { flex: 1; min-width: 0; }
                .wk-item-title { font-size: 0.875rem; font-weight: 600; color: var(--text); }
                .wk-item-detail { font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.2rem; line-height: 1.4; }
                .wk-item-date { font-size: 0.6875rem; color: var(--muted); margin-top: 0.25rem; text-transform: capitalize; }
                .wk-type-badge { font-size: 0.6875rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 99px; flex-shrink: 0; align-self: flex-start; }
            `}</style>
        </Shell>
    )
}
