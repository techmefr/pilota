import { createPilota } from '@pilota/core'
import { NhostDriver } from '@pilota/driver-nhost'
import { sessionResource, taskResource, participantResource, voteResource } from './resources.ts'

export type NhostResult<T> = { data: T | null; errors?: unknown[] }

export function createVotaPilota(endpoint: string, adminSecret?: string) {
    const nhost = new NhostDriver({ endpoint, adminSecret })
    return createPilota({
        drivers: { nhost },
        resources: {
            nhost: {
                planning_sessions: sessionResource,
                planning_tasks: taskResource,
                planning_participants: participantResource,
                planning_votes: voteResource,
            },
        },
    })
}

export type VotaSDK = ReturnType<typeof createVotaPilota>
