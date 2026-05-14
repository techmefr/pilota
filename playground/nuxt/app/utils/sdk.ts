import { createPilota } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import { NhostDriver } from '@pilota/driver-nhost'
import { SupabaseDriver } from '@pilota/driver-supabase'
import { createNotify } from '@pilota/hooks'
import { cartItemResource } from '../resources/cart-item.resource'
import { messageResource } from '../resources/message.resource'
import { productResource } from '../resources/product.resource'
import { createLogAdapter } from '../composables/useNotify'

const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7W9oLDDBTT5ACpLOvTgWcGw3MvFG-7J2Ycw'

const nhost = new NhostDriver({
    endpoint: 'http://localhost:1337/v1/graphql',
    adminSecret: 'pilota-admin-secret',
})

const lomkit = new LomkitDriver({ baseUrl: 'http://localhost:8000/api' })

const supabase = new SupabaseDriver({
    url: 'http://localhost:54321',
    key: SUPABASE_ANON_KEY,
})

nhost.bindResource('products', productResource)
lomkit.bindResource('cartItems', cartItemResource)
supabase.bindResource('messages', messageResource)

export const sdk = createPilota({
    drivers: { nhost, lomkit, supabase },
    notify: createNotify(createLogAdapter()),
})
export { cartItemResource, messageResource, productResource }
