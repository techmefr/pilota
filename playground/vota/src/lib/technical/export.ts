import type { Session, Task, Vote } from './types.ts'

export interface ExportTask {
    title: string
    description: string
    link: string
    tags: string[]
    added_by: string
    estimate: string | null
}

export interface ExportData {
    session: Session
    tasks: ExportTask[]
    votes: Vote[]
}

export function toCSV(data: ExportData): string {
    const header = ['Titre', 'Description', 'Lien', 'Tags', 'Ajouté par', 'Estimation'].join(';')
    const rows = data.tasks.map(t => [
        `"${t.title.replace(/"/g, '""')}"`,
        `"${(t.description || '').replace(/"/g, '""')}"`,
        t.link || '',
        `"${t.tags.join(', ')}"`,
        t.added_by,
        t.estimate ?? 'Non chiffré',
    ].join(';'))
    return [header, ...rows].join('\n')
}

export function toJSON(data: ExportData): string {
    return JSON.stringify({
        session: {
            name: data.session.name,
            project: data.session.project,
            scale: data.session.scale,
            date: data.session.created_at,
        },
        tasks: data.tasks.map(t => ({
            title: t.title,
            description: t.description,
            link: t.link,
            tags: t.tags,
            estimate: t.estimate,
        })),
    }, null, 2)
}

export function toJiraText(tasks: Task[]): string {
    return tasks.map(t => {
        const estimate = t.estimate ? ` (${t.estimate})` : ''
        return `${t.title}${estimate}`
    }).join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export function printAsPDF(): void {
    window.print()
}
