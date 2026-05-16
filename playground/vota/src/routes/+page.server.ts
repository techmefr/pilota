import type { PageServerLoad } from './$types'
import { createVotaPilota } from '$lib/pilota'
import type { Product } from '$lib/pilota'

export const load: PageServerLoad = async () => {
    const endpoint = process.env.NHOST_GRAPHQL_URL ?? 'http://host.docker.internal:8080/v1/graphql'
    const pilota = createVotaPilota(endpoint)

    let products: Product[] = []

    try {
        const result = await pilota.nhost.products.query()
        const raw: Record<string, unknown>[] = result.data?.products ?? []
        products = raw.map(p => ({
            id: Number(p.id),
            name: String(p.name),
            description: String(p.description ?? ''),
            price: Number(p.price),
            image: String(p.image ?? ''),
            category: String(p.category),
            stock: Number(p.stock),
        }))
    } catch {
        products = []
    }

    return { products }
}
