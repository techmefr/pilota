import { defineDriver, resolveHeaders } from 'nexdk'
import type { TemplateConfig, TemplateResourceApi } from './types.ts'

// Re-exported so `driver.ts` and the augmentation in `types.ts` stay in sync.
export type { TemplateResourceApi }

// State built once from the config and spread into every method's ctx.
interface TemplateState {
    baseUrl: string
    buildHeaders: () => Promise<Record<string, string>>
}

// Perform the fetch and throw on a non-OK response. defineDriver's wrapper turns
// the throw into emit('error') + rethrow, so the event contract is honored for
// free — never write the try/catch yourself.
async function request<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(url, init)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    // TODO: unwrap your backend's response envelope here (e.g. `(await
    // response.json()).data`) instead of returning the raw body.
    return (await response.json()) as T
}

// Minimal generic REST driver. Built with defineDriver: the method bodies carry
// only the protocol translation; request/success/error events are supplied by
// the helper. Fill in the TODOs to target your backend.
//
// TODO: rename this to <backend>Driver and set `name` to your backend uri.
export const templateDriver = defineDriver<TemplateConfig, TemplateState, {
    get: (ctx: TemplateState & { resourceName: string }, payload: unknown) => Promise<unknown>
    create: (ctx: TemplateState & { resourceName: string }, payload: unknown) => Promise<unknown>
    // TODO: add find/update/remove signatures here, then implement them below.
}>({
    name: 'template',
    setup: config => {
        const baseUrl = config.baseUrl.replace(/\/$/, '')
        return {
            baseUrl,
            buildHeaders: async () => ({
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(await resolveHeaders(config.headers)),
            }),
        }
    },
    methods: {
        // GET /{resource}. TODO: adjust the URL shape (query params, nesting,
        // pluralization) to match your backend.
        get: async (ctx, _payload) => {
            const url = `${ctx.baseUrl}/${ctx.resourceName}`
            return request(url, { method: 'GET', headers: await ctx.buildHeaders() })
        },
        // POST /{resource}. TODO: map the payload to your create body shape.
        create: async (ctx, payload) => {
            const url = `${ctx.baseUrl}/${ctx.resourceName}`
            return request(url, {
                method: 'POST',
                headers: await ctx.buildHeaders(),
                body: JSON.stringify(payload ?? {}),
            })
        },
        // TODO: add find (GET /{resource}/{id}), update (PATCH/PUT), remove
        // (DELETE) following the same request(...) pattern.
    },
})

// Factory returning a driver carrying the `__apiUri` phantom marker, so the typed
// SDK resolves each resource to TemplateResourceApi<T>.
//
// TODO: rename to create<Backend>Driver and change the 'template' uri to match
// types.ts and the driver `name`.
export function createTemplateDriver(config: TemplateConfig): ReturnType<typeof templateDriver> & { __apiUri: 'template' } {
    return templateDriver(config) as ReturnType<typeof templateDriver> & { __apiUri: 'template' }
}
