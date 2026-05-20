import { sdk } from '@/technical/Sdk'
import { mockAbsences } from '@/technical/Sdk/mock'
import type { Absence } from '@/technical/Sdk'

export type { Absence }

export async function fetchAbsences(): Promise<Absence[]> {
    try {
        const result = await (sdk as any).lomkit.absences.get()
        return result.data ?? mockAbsences
    } catch {
        return mockAbsences
    }
}
