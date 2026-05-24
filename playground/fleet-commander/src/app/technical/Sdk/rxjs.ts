import { Observable } from 'rxjs'

export function fromLomkit<T>(promise: Promise<{ data: T[] | null }>): Observable<T[]> {
    return new Observable<T[]>(subscriber => {
        promise
            .then(result => {
                subscriber.next(result.data ?? [])
                subscriber.complete()
            })
            .catch((err: unknown) => subscriber.error(err))
    })
}

export function fromPilotaSubscription<T>(
    subscribeFactory: (handler: (event: T) => void) => () => void,
): Observable<T> {
    return new Observable<T>(subscriber => {
        const unsubscribe = subscribeFactory(event => subscriber.next(event))
        return () => unsubscribe()
    })
}
