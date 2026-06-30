import { createPilota } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import { pcProfileResource, assignmentResource, orderResource, alertResource, repairResource } from './resources'

const lomkit = new LomkitDriver({
    baseUrl: (import.meta.env.LARAVEL_API_URL as string | undefined) ?? 'http://localhost:8000/api',
})

export const sdk = createPilota({
    drivers: { lomkit },
    resources: {
        lomkit: {
            pcProfiles: pcProfileResource,
            assignments: assignmentResource,
            orders: orderResource,
            alerts: alertResource,
            repairs: repairResource,
        },
    },
})
