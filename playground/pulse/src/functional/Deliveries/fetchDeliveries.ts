import { sdk } from '@/technical/Sdk'
import { mockDeliveries } from '@/technical/Sdk/mock'
import type { Delivery } from '@/technical/Sdk'

export type { Delivery }

export async function fetchDeliveries(): Promise<Delivery[]> {
    try {
        const result = await sdk.lomkit.deliveries.get()
        return result.data ?? mockDeliveries
    } catch {
        return mockDeliveries
    }
}
