import { sdk } from '@/technical/Sdk'
import { mockRevenue, mockContracts } from '@/technical/Sdk/mock'
import type { Revenue, Contract } from '@/technical/Sdk'

export type { Revenue, Contract }

export async function fetchRevenue(): Promise<Revenue> {
    try {
        const result = await (sdk as any).lomkit.revenue.get()
        return result.data?.[0] ?? mockRevenue
    } catch {
        return mockRevenue
    }
}

export async function fetchContracts(): Promise<Contract[]> {
    try {
        const result = await (sdk as any).lomkit.contracts.get()
        return result.data ?? mockContracts
    } catch {
        return mockContracts
    }
}
