import type { PilotaConfig, PilotaDriver, PilotaEventHandler, PilotaSDK } from './types.ts'

export function createPilota<TDrivers extends Record<string, PilotaDriver>>(
    config: PilotaConfig<TDrivers>,
): PilotaSDK<TDrivers> {
    const sdk = {} as PilotaSDK<TDrivers>
    const globalHandler = config.notify

    for (const key in config.drivers) {
        const driver = config.drivers[key]
        sdk[key] = createDriverProxy(driver, globalHandler) as PilotaSDK<TDrivers>[typeof key]
    }

    return sdk
}

function mergeEventHandlers(
    global: PilotaEventHandler | undefined,
    local: PilotaEventHandler | undefined,
): PilotaEventHandler | undefined {
    if (global === undefined) return local
    if (local === undefined) return global
    return (event, data) => {
        global(event, data)
        local(event, data)
    }
}

function createDriverProxy<TDriver extends PilotaDriver>(
    driver: TDriver,
    globalHandler?: PilotaEventHandler,
): TDriver {
    return new Proxy(driver, {
        get(target, prop: string) {
            if (prop in target) {
                const value = (target as Record<string, unknown>)[prop]
                return typeof value === 'function' ? value.bind(target) : value
            }

            return createResourceProxy(target, prop, globalHandler)
        },
    })
}

function createResourceProxy(
    driver: PilotaDriver,
    resourceName: string,
    globalHandler?: PilotaEventHandler,
): unknown {
    return new Proxy(
        {},
        {
            get(_target, methodName: string) {
                return (payload?: unknown, onEvent?: unknown, mock?: unknown) => {
                    const method = (driver as unknown as Record<string, unknown>)[methodName]

                    if (typeof method !== 'function') {
                        throw new Error(
                            `Driver "${driver.name}" has no method "${methodName}" for resource "${resourceName}"`,
                        )
                    }

                    const handler = mergeEventHandlers(
                        globalHandler,
                        onEvent as PilotaEventHandler | undefined,
                    )

                    return (method as (...args: unknown[]) => unknown).call(driver, resourceName, payload, handler, mock)
                }
            },
        },
    )
}
