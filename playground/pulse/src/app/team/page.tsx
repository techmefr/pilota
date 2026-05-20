import Shell from '@/technical/Layout/Shell'
import { fetchAbsences } from '@/functional/Absences/fetchAbsences'
import { getCurrentWeek } from '@/functional/Objectives/fetchObjectives'
import type { Absence } from '@/functional/Absences/fetchAbsences'

const DAYS: Absence['days'][number][] = ['lun', 'mar', 'mer', 'jeu', 'ven']
const DAY_LABELS: Record<typeof DAYS[number], string> = { lun: 'Lundi', mar: 'Mardi', mer: 'Mercredi', jeu: 'Jeudi', ven: 'Vendredi' }
const WEEKDAY_TO_KEY: Record<number, typeof DAYS[number] | null> = {
    0: null, 1: 'lun', 2: 'mar', 3: 'mer', 4: 'jeu', 5: 'ven', 6: null,
}
const REASON_CONFIG = {
    conge:       { label: 'Congé',       color: 'var(--orange)' },
    teletravail: { label: 'Télétravail', color: 'var(--primary)' },
    formation:   { label: 'Formation',   color: 'var(--green)' },
    client:      { label: 'Client',      color: 'var(--yellow)' },
    maladie:     { label: 'Maladie',     color: 'var(--red)' },
}
const TEAM = ['Gaetan', 'Alice', 'Bob', 'Clara', 'Damien']

function hue(name: string) {
    return [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
}

export default async function TeamPage() {
    const { week } = getCurrentWeek()
    const absences = await fetchAbsences()
    const absentKey = new Set(absences.flatMap(a => a.days.map(d => `${a.person}-${d}`)))
    const todayKey = WEEKDAY_TO_KEY[new Date().getDay()]
    const absentToday = todayKey ? absences.filter(a => a.days.includes(todayKey)).length : 0

    return (
        <Shell
            title="Congés / Équipe"
            subtitle={`Semaine ${week} · ${absentToday} absent${absentToday > 1 ? 's' : ''} aujourd'hui`}
        >
            <div className="tl">
                <h2 className="tl-title">Planning de la semaine</h2>
                <div className="tl-grid">
                    <div className="tl-header-row">
                        <div />
                        {DAYS.map(d => (
                            <div
                                key={d}
                                className={`tl-daylabel${d === todayKey ? ' tl-daylabel-today' : ''}`}
                            >
                                {DAY_LABELS[d]}
                            </div>
                        ))}
                    </div>
                    {TEAM.map(person => {
                        const pa = absences.filter(a => a.person === person)
                        return (
                            <div key={person} className="tl-row">
                                <div className="tl-person">
                                    <span className="tl-avatar" style={{ background: `oklch(45% 0.18 ${hue(person)})` }}>
                                        {person.slice(0, 2).toUpperCase()}
                                    </span>
                                    {person}
                                </div>
                                {DAYS.map(day => {
                                    const isAbsent = absentKey.has(`${person}-${day}`)
                                    const isToday = day === todayKey
                                    const ab = pa.find(a => a.days.includes(day))
                                    const cfg = ab ? REASON_CONFIG[ab.reason] : null
                                    return (
                                        <div
                                            key={day}
                                            className={[
                                                'tl-cell',
                                                isAbsent ? 'tl-absent' : 'tl-present',
                                                isToday ? 'tl-today' : '',
                                            ].join(' ').trim()}
                                            style={isAbsent ? { color: cfg?.color, borderColor: cfg?.color } : {}}
                                            title={ab?.note ?? cfg?.label ?? 'Présent'}
                                        >
                                            {isAbsent ? cfg?.label : ''}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>

                <div className="tl-legend">
                    {Object.entries(REASON_CONFIG).map(([k, cfg]) => (
                        <span key={k} className="tl-legend-item" style={{ color: cfg.color }}>
                            <span className="tl-dot" style={{ background: cfg.color }} />
                            {cfg.label}
                        </span>
                    ))}
                </div>
            </div>

            <style>{`
                .tl { display: flex; flex-direction: column; gap: 1.5rem; max-width: 800px; }
                .tl-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
                .tl-grid { display: flex; flex-direction: column; gap: 0.25rem; }
                .tl-header-row, .tl-row { display: grid; grid-template-columns: 130px repeat(5, 1fr); gap: 0.25rem; }
                .tl-daylabel { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); text-align: center; padding: 0.25rem 0; border-radius: var(--radius-sm); }
                .tl-daylabel-today { color: var(--primary); background: color-mix(in srgb, var(--primary) 8%, transparent); }
                .tl-person { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 500; color: var(--text); }
                .tl-avatar { width: 1.5rem; height: 1.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.5625rem; font-weight: 700; color: white; flex-shrink: 0; }
                .tl-cell { border-radius: var(--radius-sm); padding: 0.4rem 0.25rem; font-size: 0.625rem; font-weight: 600; text-align: center; border: 1.5px solid transparent; line-height: 1.2; }
                .tl-cell.tl-today { outline: 2px solid color-mix(in srgb, var(--primary) 30%, transparent); outline-offset: 1px; }
                .tl-present { background: color-mix(in srgb, var(--green) 8%, transparent); }
                .tl-absent { background: color-mix(in srgb, currentColor 8%, transparent); }
                .tl-legend { display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem; }
                .tl-legend-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8125rem; font-weight: 500; }
                .tl-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
            `}</style>
        </Shell>
    )
}
