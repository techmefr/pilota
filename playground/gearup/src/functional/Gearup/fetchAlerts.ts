import { sdk } from '../../technical/Sdk'
import { mockAlerts } from '../../technical/Sdk/mock'
import type { Alert } from '../../technical/Sdk/resources'

export type { Alert }

export async function fetchAlerts(): Promise<Alert[]> {
    try {
        const result = await sdk.lomkit.alerts.get()
        const fetched = result.data ?? []
        return fetched.length > 0 ? fetched : mockAlerts
    } catch {
        return mockAlerts
    }
}
