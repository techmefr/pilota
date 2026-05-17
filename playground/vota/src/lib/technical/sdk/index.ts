import { createPilota } from '@pilota/core'
import { NhostDriver } from '@pilota/driver-nhost'
import { sessionResource, taskResource, participantResource, voteResource } from './resources.ts'

export type NhostResult<T> = { data: T | null; errors?: unknown[] }

function createNhostDriver(endpoint: string, adminSecret?: string): NhostDriver {
    const driver = new NhostDriver({ endpoint, adminSecret })
    driver.bindResource('planning_sessions', sessionResource)
    driver.bindResource('planning_tasks', taskResource)
    driver.bindResource('planning_participants', participantResource)
    driver.bindResource('planning_votes', voteResource)
    return driver
}

export function createVotaPilota(endpoint: string, adminSecret?: string) {
    const nhost = createNhostDriver(endpoint, adminSecret)
    return createPilota({ drivers: { nhost } })
}

export type VotaSDK = ReturnType<typeof createVotaPilota>
