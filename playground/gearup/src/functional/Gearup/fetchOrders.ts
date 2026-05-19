import { sdk } from '../../technical/Sdk'
import { mockOrders } from '../../technical/Sdk/mock'
import type { Order } from '../../technical/Sdk/resources'

export type { Order }

export async function fetchOrders(): Promise<Order[]> {
    try {
        const result = await sdk.lomkit.orders.get()
        const fetched = result.data ?? []
        return fetched.length > 0 ? fetched : mockOrders
    } catch {
        return mockOrders
    }
}
