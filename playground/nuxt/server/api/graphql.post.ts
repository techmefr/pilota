// Same-origin GraphQL proxy for the Nhost / Hasura driver.
//
// The browser-side Nhost driver points at this route (`/api/graphql`) and is
// constructed WITHOUT any admin secret. This handler runs on the Nitro server,
// reads the SERVER-ONLY `NHOST_ADMIN_SECRET` (never prefixed with VITE_/PUBLIC_,
// so it is never inlined into the client bundle) and forwards the request to the
// real Hasura endpoint with the `x-hasura-admin-secret` header injected here.
//
// The secret therefore lives only on the server: the browser never sees it.
// HTTP queries/mutations go through this proxy. WebSocket subscriptions cannot
// carry the secret and must rely on a Hasura `anonymous` role — see the SDK
// wiring (`layers/technical/sdk/index.ts`) and the README "Sécurité" section.
export default defineEventHandler(async event => {
    const config = useRuntimeConfig(event)
    const endpoint = config.nhostEndpoint || process.env.NHOST_ENDPOINT
    const adminSecret = config.nhostAdminSecret || process.env.NHOST_ADMIN_SECRET

    if (!endpoint) {
        throw createError({ statusCode: 500, statusMessage: 'NHOST_ENDPOINT is not configured on the server' })
    }

    const body = await readRawBody(event)

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(adminSecret ? { 'x-hasura-admin-secret': adminSecret } : {}),
        },
        body: body ?? undefined,
    })

    setResponseStatus(event, response.status)
    setResponseHeader(event, 'Content-Type', 'application/json')
    return await response.text()
})
