import type { PilotaConfig, PilotaDriver, PilotaSDK } from './types.ts'

export function createPilota<TDrivers extends Record<string, PilotaDriver>>(
    config: PilotaConfig<TDrivers>,
): PilotaSDK<TDrivers> {
    const sdk = {} as PilotaSDK<TDrivers>

    for (const key in config.drivers) {
        const driver = config.drivers[key]
        sdk[key] = createDriverProxy(driver) as PilotaSDK<TDrivers>[typeof key]
    }

    return sdk
}

function createDriverProxy<TDriver extends PilotaDriver>(driver: TDriver): TDriver {
    return new Proxy(driver, {
        get(target, prop: string) {
            if (prop in target) {
                const value = (target as Record<string, unknown>)[prop]
                return typeof value === 'function' ? value.bind(target) : value
            }

            return createResourceProxy(target, prop)
        },
    })
}

function createResourceProxy(driver: PilotaDriver, resourceName: string): unknown {
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

                    return (method as Function).call(driver, resourceName, payload, onEvent, mock)
                }
            },
        },
    )
}
