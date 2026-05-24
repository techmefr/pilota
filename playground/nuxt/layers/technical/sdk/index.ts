import { createPilota } from '@pilota/core'
import type { PilotaEventHandler } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import type { LomkitGetResult, LomkitMutateResult, LomkitDeleteResult } from '@pilota/driver-lomkit'
import { NhostDriver } from '@pilota/driver-nhost'
import type { NhostQueryResult } from '@pilota/driver-nhost'
import { SupabaseDriver } from '@pilota/driver-supabase'
import { createNotify } from '@pilota/hooks'
import type { PilotaNotifyAdapter } from '@pilota/hooks'
import {
    cartItemResource,
    messageResource,
    productResource,
    shopOrderResource,
} from './resources'
import type { CartItem, Message, Product, ShopOrder } from './resources'

type ProductsApi = {
    query: (p: object, onEvent?: PilotaEventHandler) => Promise<NhostQueryResult<{ products: Product[] }>>
}

type CartItemsApi = {
    get: (p: object, onEvent?: PilotaEventHandler) => Promise<LomkitGetResult<CartItem>>
    mutate: (p: object, onEvent?: PilotaEventHandler) => Promise<LomkitMutateResult<CartItem>>
    delete: (p: { resources: number[] }, onEvent?: PilotaEventHandler) => Promise<LomkitDeleteResult>
}

type ShopOrdersApi = {
    get: (p: object, onEvent?: PilotaEventHandler) => Promise<LomkitGetResult<ShopOrder>>
}

type MessagesApi = {
    subscribe: (p: object, handler: PilotaEventHandler) => () => void
    insert: (p: object) => Promise<unknown>
}

function createLogAdapter(): PilotaNotifyAdapter {
    return {
        onRequest: ctx => console.log(`[pilota] -> ${ctx.resource ?? '?'}`),
        onSuccess: data => console.log('[pilota] ok', data),
        onError: err => console.error('[pilota] error', err.message),
    }
}

const nhost = new NhostDriver({
    endpoint: import.meta.env.VITE_NHOST_ENDPOINT as string,
    adminSecret: import.meta.env.VITE_NHOST_ADMIN_SECRET as string,
})

const lomkit = new LomkitDriver({
    baseUrl: import.meta.env.VITE_LOMKIT_BASE_URL as string,
})

const supabase = new SupabaseDriver({
    url: import.meta.env.VITE_SUPABASE_URL as string,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
})

nhost.bindResource('products', productResource)
lomkit.bindResource('cartItems', cartItemResource)
lomkit.bindResource('shopOrders', shopOrderResource)
supabase.bindResource('messages', messageResource)

const _sdk = createPilota({
    drivers: { nhost, lomkit, supabase },
    notify: import.meta.dev ? createNotify(createLogAdapter()) : undefined,
})

export const sdk = _sdk as typeof _sdk & {
    nhost: NhostDriver & { products: ProductsApi }
    lomkit: LomkitDriver & { cartItems: CartItemsApi; shopOrders: ShopOrdersApi }
    supabase: SupabaseDriver & { messages: MessagesApi }
}

export const apiBase = (): string =>
    (import.meta.env.VITE_LOMKIT_BASE_URL as string | undefined)?.replace(/\/api$/, '') ||
    'http://main-api.localhost'
