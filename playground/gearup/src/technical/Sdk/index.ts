import { createPilota } from '@pilota/core'
import type { PilotaEventHandler } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import type { LomkitGetResult } from '@pilota/driver-lomkit'
import { pcProfileResource, assignmentResource, orderResource, alertResource, repairResource } from './resources'
import type { PcProfile, Assignment, Order, Alert, Repair } from './resources'

type PcProfilesApi = {
    get: (payload?: object, onEvent?: PilotaEventHandler, mock?: PcProfile) => Promise<LomkitGetResult<PcProfile>>
}

type AssignmentsApi = {
    get: (payload?: object, onEvent?: PilotaEventHandler, mock?: Assignment) => Promise<LomkitGetResult<Assignment>>
}

type OrdersApi = {
    get: (payload?: object, onEvent?: PilotaEventHandler, mock?: Order) => Promise<LomkitGetResult<Order>>
}

type AlertsApi = {
    get: (payload?: object, onEvent?: PilotaEventHandler, mock?: Alert) => Promise<LomkitGetResult<Alert>>
}

type RepairsApi = {
    get: (payload?: object, onEvent?: PilotaEventHandler, mock?: Repair) => Promise<LomkitGetResult<Repair>>
}

const lomkit = new LomkitDriver({
    baseUrl: import.meta.env.LARAVEL_API_URL as string,
})

lomkit.bindResource('pcProfiles', pcProfileResource)
lomkit.bindResource('assignments', assignmentResource)
lomkit.bindResource('orders', orderResource)
lomkit.bindResource('alerts', alertResource)
lomkit.bindResource('repairs', repairResource)

const _sdk = createPilota({ drivers: { lomkit } })

export const sdk = _sdk as typeof _sdk & {
    lomkit: LomkitDriver & {
        pcProfiles: PcProfilesApi
        assignments: AssignmentsApi
        orders: OrdersApi
        alerts: AlertsApi
        repairs: RepairsApi
    }
}
