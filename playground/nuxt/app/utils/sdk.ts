import { createPilota } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import { NhostDriver } from '@pilota/driver-nhost'
import { SupabaseDriver } from '@pilota/driver-supabase'
import { messageResource } from '../resources/message.resource'
import { postResource } from '../resources/post.resource'
import { userResource } from '../resources/user.resource'

const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7W9oLDDBTT5ACpLOvTgWcGw3MvFG-7J2Ycw'

const lomkit = new LomkitDriver({ baseUrl: 'http://localhost:8000/api' })
const nhost = new NhostDriver({
    endpoint: 'http://localhost:1337/v1/graphql',
    adminSecret: 'pilota-admin-secret',
})
const supabase = new SupabaseDriver({
    url: 'http://localhost:54321',
    key: SUPABASE_ANON_KEY,
})

lomkit.bindResource('users', userResource)
lomkit.bindResource('posts', postResource)
nhost.bindResource('users', userResource)
nhost.bindResource('posts', postResource)
nhost.bindResource('messages', messageResource)
supabase.bindResource('users', userResource)
supabase.bindResource('messages', messageResource)

export const sdk = createPilota({ drivers: { lomkit, nhost, supabase } })
export { messageResource, postResource, userResource }
