<script lang="ts">
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()
</script>

<main style="padding: 2rem; max-width: 1100px; margin: 0 auto;">
    <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 style="font-size: 1.75rem; font-weight: 700; color: var(--primary);">Vota</h1>
            <p style="color: var(--muted); font-size: 0.85rem; margin-top: 0.25rem;">
                Pilota SDK · NhostDriver · SvelteKit 2 · Hasura :8080
            </p>
        </div>
        <a href="http://localhost:9999" style="font-size: 0.8rem; color: var(--muted);">← Hub</a>
    </header>

    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
        <span style="font-size: 0.7rem; font-weight: 600; padding: 0.3rem 0.75rem; border-radius: 99px; background: #1a2a1a; color: var(--green); border: 1px solid #2a4a2a;">
            {data.products.length} produits chargés
        </span>
        <span style="font-size: 0.75rem; color: var(--muted);">via GraphQL query</span>
    </div>

    {#if data.products.length === 0}
        <div style="padding: 3rem; background: var(--surface); border-radius: 1rem; border: 1px solid var(--border); text-align: center; color: var(--muted);">
            <p style="font-size: 1rem; margin-bottom: 0.5rem;">Aucun produit — Hasura offline ?</p>
            <code style="font-size: 0.75rem;">GraphQL http://localhost:8080/v1/graphql</code>
        </div>
    {:else}
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
            {#each data.products as p (p.id)}
                <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 1rem; padding: 1.25rem;">
                    <div style="font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.5rem;">
                        {p.category}
                    </div>
                    <div style="font-weight: 600; margin-bottom: 0.75rem;">{p.name}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">
                            {p.price.toFixed(2)} €
                        </span>
                        <span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 99px; background: {p.stock > 0 ? '#1a2a1a' : '#2a1a1a'}; color: {p.stock > 0 ? 'var(--green)' : 'var(--red)'};">
                            {p.stock > 0 ? `Stock: ${p.stock}` : 'Rupture'}
                        </span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>
