import Shell from '@/technical/Layout/Shell'
import ProjectHealthCard from '@/functional/ProjectHealth/components/ProjectHealthCard'
import { fetchProjects } from '@/functional/ProjectHealth/fetchProjects'

export default async function HealthPage() {
    const projects = await fetchProjects()

    const critical = projects.filter(p => p.status === 'critical').length
    const warnings = projects.filter(p => p.status === 'warning').length

    return (
        <Shell
            title="Santé des projets"
            subtitle={
                critical > 0
                    ? `${critical} critique${critical > 1 ? 's' : ''} · ${warnings} attention${warnings > 1 ? 's' : ''}`
                    : `${projects.filter(p => p.status === 'ok').length} projets OK`
            }
        >
            <div className="health-grid">
                {projects.map(project => (
                    <ProjectHealthCard key={project.id} project={project} />
                ))}
            </div>

            <style>{`
                .health-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1rem;
                }
            `}</style>
        </Shell>
    )
}
