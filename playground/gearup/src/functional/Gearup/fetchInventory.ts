import { sdk } from '../../technical/Sdk'
import { mockAssignments } from '../../technical/Sdk/mock'
import type { Assignment } from '../../technical/Sdk/resources'

export type { Assignment }

export async function fetchInventory(): Promise<Assignment[]> {
    try {
        const result = await sdk.lomkit.assignments.get()
        const fetched = result.data ?? []
        return fetched.length > 0 ? fetched : mockAssignments
    } catch {
        return mockAssignments
    }
}
