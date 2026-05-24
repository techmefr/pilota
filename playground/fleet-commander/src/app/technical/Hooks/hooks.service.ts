import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { createPilotaHooks } from '@pilota/hooks'
import type { PilotaEvent } from '@pilota/hooks'

@Injectable({ providedIn: 'root' })
export class HooksService {
    readonly bus = createPilotaHooks()

    observeHook(name: PilotaEvent): Observable<unknown> {
        return new Observable<unknown>(subscriber => {
            const handler = (data?: unknown): void => subscriber.next(data)
            this.bus.hook(name, handler)
            return () => {
                this.bus.removeHook(name, handler)
            }
        })
    }
}
