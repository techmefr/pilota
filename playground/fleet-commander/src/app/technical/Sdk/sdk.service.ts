import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { createPilota } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
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

@Injectable({ providedIn: 'root' })
export class SdkService {
    private readonly sdk: ReturnType<SdkService['createSdk']>
    private readonly supabase: SupabaseDriver

    constructor() {
        const env = window.__fleet_env

        this.supabase = new SupabaseDriver({
            url: env?.supabaseUrl ?? 'http://localhost:54321',
            key: env?.supabaseAnonKey ?? 'pilota',
        })

        this.sdk = this.createSdk(env)
    }

    private createSdk(env: Window['__fleet_env']) {
        const lomkit = new LomkitDriver({ baseUrl: env?.laravelApiUrl ?? '' })
        const nhost = new NhostDriver({ endpoint: env?.nhostEndpoint ?? '' })

        return createPilota({
            drivers: { lomkit, supabase: this.supabase, nhost },
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
    }

    assignments$(filters?: Record<string, unknown>): Observable<Assignment[]> {
        return fromLomkit<Assignment>(
            this.sdk.lomkit.assignments.get(filters ?? {}, undefined, mockAssignments),
        )
    }

    pcProfiles$(): Observable<PcProfile[]> {
        return fromLomkit<PcProfile>(
            this.sdk.lomkit.pcProfiles.get({}, undefined, mockPcProfiles),
        )
    }

    orders$(): Observable<Order[]> {
        return fromLomkit<Order>(
            this.sdk.lomkit.orders.get({}, undefined, mockOrders),
        )
    }

    alerts$(): Observable<Alert[]> {
        return fromLomkit<Alert>(
            this.sdk.lomkit.alerts.get({}, undefined, mockAlerts),
        )
    }

    repairs$(): Observable<Repair[]> {
        return fromLomkit<Repair>(
            this.sdk.lomkit.repairs.get({}, undefined, mockRepairs),
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
