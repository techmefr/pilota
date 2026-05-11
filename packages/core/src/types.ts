import type { ZodTypeAny, z } from 'zod'

export type AnyResource = Resource<ZodTypeAny>

export interface ResourceConfig<TSchema extends ZodTypeAny> {
    name: string
    schema: TSchema
    fragments?: Record<string, string[]>
    relations?: Record<string, () => AnyResource>
}

export interface Resource<TSchema extends ZodTypeAny> {
    name: string
    schema: TSchema
    fragments: Record<string, string[]>
    relations: Record<string, () => AnyResource>
}

export type InferSchema<TResource extends AnyResource> = z.infer<TResource['schema']>

export type PilotaEventHandler = (event: string, data?: unknown) => void

export type AsyncMethod<TReturn> = (
    payload?: unknown,
    onEvent?: PilotaEventHandler,
    mock?: unknown,
) => Promise<TReturn>

export type ReactiveMethod = (
    payload?: unknown,
    onEvent?: PilotaEventHandler,
) => () => void

export interface PilotaDriver {
    readonly name: string
    bindResource(resourceName: string, resource: AnyResource): void
}

export type DriverResourceProxy<TDriver extends PilotaDriver> =
    TDriver & Record<string, unknown>

export type PilotaConfig<TDrivers extends Record<string, PilotaDriver>> = {
    drivers: TDrivers
}

export type PilotaSDK<TDrivers extends Record<string, PilotaDriver>> = {
    [K in keyof TDrivers]: TDrivers[K]
}
