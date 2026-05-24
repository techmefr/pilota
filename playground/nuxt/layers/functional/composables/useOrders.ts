import { sdk } from '../../technical/sdk/index'
import type { ShopOrder } from '../../technical/sdk/resources'

export function useOrders() {
    const orders = ref<ShopOrder[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function fetchOrders(): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const result = await sdk.lomkit.shopOrders.get({
                sorts: [{ field: 'created_at', direction: 'desc' }],
            })
            orders.value = result.data ?? []
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Erreur de chargement'
        } finally {
            isLoading.value = false
        }
    }

    async function fetchOrder(id: number): Promise<ShopOrder | null> {
        try {
            const result = await sdk.lomkit.shopOrders.get({
                filters: [{ field: 'id', operator: '=', value: id }],
                includes: [{ relation: 'items' }],
            })
            return result.data?.[0] ?? null
        } catch {
            return null
        }
    }

    return { orders, isLoading, error, fetchOrders, fetchOrder }
}
