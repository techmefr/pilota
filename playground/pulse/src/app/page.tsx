import { pilota } from '@/lib/pilota'
import type { Product } from '@/lib/pilota'

async function getProducts(): Promise<Product[]> {
    try {
        const result = await pilota.lomkit.products.get()
        return result.data ?? []
    } catch {
        return []
    }
}

export default async function Home() {
    const products = await getProducts()

    return (
        <main style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>Pulse</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Pilota SDK · LomkitDriver · Next.js 15 · Laravel :8000
                    </p>
                </div>
                <a href="http://localhost:9999" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>← Hub</a>
            </header>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{
                    fontSize: '0.7rem', fontWeight: 600, padding: '0.3rem 0.75rem',
                    borderRadius: '99px', background: '#1a2a1a', color: 'var(--green)',
                    border: '1px solid #2a4a2a'
                }}>
                    {products.length} produits chargés
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>via Lomkit REST API</span>
            </div>

            {products.length === 0 ? (
                <div style={{
                    padding: '3rem', background: 'var(--surface)', borderRadius: '1rem',
                    border: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)'
                }}>
                    <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Aucun produit — Laravel offline ?</p>
                    <code style={{ fontSize: '0.75rem' }}>POST http://localhost:8000/api/products/search</code>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1rem'
                }}>
                    {products.map(p => (
                        <div key={p.id} style={{
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: '1rem', padding: '1.25rem'
                        }}>
                            <div style={{
                                fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em',
                                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem'
                            }}>
                                {p.category}
                            </div>
                            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{p.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    {p.price.toFixed(2)} €
                                </span>
                                <span style={{
                                    fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '99px',
                                    background: p.stock > 0 ? '#1a2a1a' : '#2a1a1a',
                                    color: p.stock > 0 ? 'var(--green)' : 'var(--red)'
                                }}>
                                    {p.stock > 0 ? `Stock: ${p.stock}` : 'Rupture'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
