import Shell from '@/technical/Layout/Shell'

export default function Page() {
    return (
        <Shell title="Besoins DevOps" subtitle="Sujets en cours et incidents récurrents">
            <div style={{
                padding: '3rem',
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: '1px dashed var(--border)',
                color: 'var(--muted)',
                fontSize: '0.875rem',
                textAlign: 'center',
            }}>
                Section en cours de développement.
            </div>
        </Shell>
    )
}
