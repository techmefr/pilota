import type { HeadersResolver, PilotaEventHandler } from 'nexdk'

// Re-exported for convenience so consumers can type their own header resolvers.
export type { HeadersResolver }

// TODO: rename to <Backend>Config and add any backend-specific config fields
// (api key, project id, region…). Keep `baseUrl` + `headers` as the base shape.
export interface TemplateConfig {
    baseUrl: string
    headers?: HeadersResolver
}

// Payload carrying the record id for by-id verbs (add these once you implement
// find/update/remove).
export interface TemplateIdPayload {
    id: number | string
}

// Per-resource API surface this driver exposes through the SDK, parameterized by
// the resource's inferred record type `T`. Core reads this via the driver's
// phantom `__apiUri` marker to type each resource end-to-end.
//
// TODO: add one method here for every method you implement in driver.ts, each
// matching the (payload, onEvent, mock) call shape. Map the return types to your
// backend's response envelope.
export interface TemplateResourceApi<T> {
    // GET /{resource} → the array.
    get(
        query?: Record<string, unknown>,
        onEvent?: PilotaEventHandler,
        mock?: T | T[],
    ): Promise<T[]>
    // POST /{resource} → the created record.
    create(
        body: Partial<T>,
        onEvent?: PilotaEventHandler,
        mock?: T,
    ): Promise<T>
}

// Register the per-resource API in core's registry so the typed SDK can resolve
// `sdk.template.<resource>` to TemplateResourceApi<T>.
//
// TODO: rename the `template` key to your backend uri (e.g. `acme`). It must
// match the `__apiUri` marker in driver.ts and the driver's `name`.
declare module 'nexdk' {
    interface ResourceApiKinds<T> {
        template: TemplateResourceApi<T>
    }
}
