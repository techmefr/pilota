import { createPilota } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import { NhostDriver } from '@pilota/driver-nhost'
import { SupabaseDriver } from '@pilota/driver-supabase'
import { createNotify } from '@pilota/hooks'
import type { PilotaNotifyAdapter } from '@pilota/hooks'
import {
    cartItemResource,
    messageResource,
    productResource,
    shopOrderResource,
} from './resources'

function createLogAdapter(): PilotaNotifyAdapter {
    return {
        onRequest: ctx => console.log(`[pilota] -> ${ctx.resource ?? '?'}`),
        onSuccess: data => console.log('[pilota] ok', data),
        onError: err => console.error('[pilota] error', err.message),
    }
}

// The Nhost driver talks to the same-origin Nitro proxy (`server/api/graphql`),
// NOT directly to Hasura. The proxy injects the `x-hasura-admin-secret` from a
// SERVER-ONLY env var, so the admin secret is never reachable from the client
// bundle. Constructed WITHOUT any adminSecret on purpose.
// Note: Shoplab's only realtime path (chat) uses the Supabase driver, so the
// Nhost driver here issues HTTP queries/mutations only — no WS subscriptions.
const nhost = new NhostDriver({
    endpoint: '/api/graphql',
})

// Driver constructors normalise their config eagerly (e.g. the Lomkit driver
// calls `baseUrl.replace(...)`, and supabase-js validates its URL), so a missing
// env var would throw at module load and blank the whole SPA. Fall back to
// harmless localhost defaults: the demo then runs against mocked/optimistic data
// (and the e2e suite, which intercepts these origins via `page.route()`).
const lomkit = new LomkitDriver({
    baseUrl: (import.meta.env.VITE_LOMKIT_BASE_URL as string | undefined) || 'http://main-api.localhost/api',
})

const supabase = new SupabaseDriver({
    url: (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'http://supabase.localhost',
    key: (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || 'anon-key',
})

export const sdk = createPilota({
    drivers: { nhost, lomkit, supabase },
    resources: {
        nhost: { products: productResource },
        lomkit: { cartItems: cartItemResource, shopOrders: shopOrderResource },
        supabase: { messages: messageResource },
    },
    notify: import.meta.dev ? createNotify(createLogAdapter()) : undefined,
})

export const apiBase = (): string =>
    (import.meta.env.VITE_LOMKIT_BASE_URL as string | undefined)?.replace(/\/api$/, '') ||
    'http://main-api.localhost'
