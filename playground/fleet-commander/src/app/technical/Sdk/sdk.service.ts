import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { createPilota } from '@pilota/core'
import type { PilotaEventHandler } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import type { LomkitGetResult } from '@pilota/driver-lomkit'
import { SupabaseDriver } from '@pilota/driver-supabase'
import { NhostDriver } from '@pilota/driver-nhost'
import {
    pcProfileResource,
    assignmentResource,
    orderResource,
    alertResource,
    repairResource,
} from './resources'
import type { PcProfile, Assignment, Order, Alert, Repair } from './resources'
import {
    mockPcProfiles,
    mockAssignments,
    mockOrders,
    mockAlerts,
    mockRepairs,
} from './mock'
import { fromLomkit, fromPilotaSubscription } from './rxjs'

declare global {
    interface Window {
        __fleet_env: {
            laravelApiUrl: string
            supabaseUrl: string
            supabaseAnonKey: string
            nhostEndpoint: string
            tolgeeApiUrl: string
            tolgeeApiKey: string
            sentryDsn: string
        }
    }
}

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

type FleetLomkit = LomkitDriver & {
    pcProfiles: PcProfilesApi
    assignments: AssignmentsApi
    orders: OrdersApi
    alerts: AlertsApi
    repairs: RepairsApi
}

@Injectable({ providedIn: 'root' })
export class SdkService {
    private readonly sdk: ReturnType<typeof createPilota> & { lomkit: FleetLomkit }
    private readonly supabase: SupabaseDriver

    constructor() {
        const env = window.__fleet_env

        const lomkit = new LomkitDriver({ baseUrl: env?.laravelApiUrl ?? '' })
        lomkit.bindResource('pcProfiles', pcProfileResource)
        lomkit.bindResource('assignments', assignmentResource)
        lomkit.bindResource('orders', orderResource)
        lomkit.bindResource('alerts', alertResource)
        lomkit.bindResource('repairs', repairResource)

        this.supabase = new SupabaseDriver({
            url: env?.supabaseUrl ?? 'http://localhost:54321',
            key: env?.supabaseAnonKey ?? 'pilota',
        })

        const _nhost = new NhostDriver({ endpoint: env?.nhostEndpoint ?? '' })

        const pilota = createPilota({ drivers: { lomkit, supabase: this.supabase, nhost: _nhost } })
        this.sdk = pilota as typeof pilota & { lomkit: FleetLomkit }
    }

    assignments$(filters?: Record<string, unknown>): Observable<Assignment[]> {
        return fromLomkit<Assignment>(
            this.sdk.lomkit.assignments.get(filters ?? {}, undefined, mockAssignments[0]),
        )
    }

    pcProfiles$(): Observable<PcProfile[]> {
        return fromLomkit<PcProfile>(
            this.sdk.lomkit.pcProfiles.get({}, undefined, mockPcProfiles[0]),
        )
    }

    orders$(): Observable<Order[]> {
        return fromLomkit<Order>(
            this.sdk.lomkit.orders.get({}, undefined, mockOrders[0]),
        )
    }

    alerts$(): Observable<Alert[]> {
        return fromLomkit<Alert>(
            this.sdk.lomkit.alerts.get({}, undefined, mockAlerts[0]),
        )
    }

    repairs$(): Observable<Repair[]> {
        return fromLomkit<Repair>(
            this.sdk.lomkit.repairs.get({}, undefined, mockRepairs[0]),
        )
    }

    fleetEvents$(): Observable<unknown> {
        return fromPilotaSubscription<unknown>(handler => {
            const unsubscribe = this.supabase.subscribe(
                'fleet_events',
                undefined,
                (eventName, payload) => {
                    if (eventName === 'data') {
                        handler(payload)
                    }
                },
            )
            return unsubscribe
        })
    }
}
