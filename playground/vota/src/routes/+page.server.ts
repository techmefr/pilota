import { redirect, fail } from '@sveltejs/kit'
import { z } from 'zod'
import type { Actions } from './$types'
import { createVotaPilota } from '$lib/technical/sdk/index.ts'
import type { NhostResult } from '$lib/technical/sdk/index.ts'
import type { Session } from '$lib/technical/types'

const ENDPOINT = process.env.NHOST_GRAPHQL_URL ?? 'http://host.docker.internal:8080/v1/graphql'

const createSessionSchema = z.object({
    name: z.string().min(1, 'Prénom requis').max(50),
    session_name: z.string().min(1, 'Nom de session requis').max(100),
    project: z.string().max(100),
    scale: z.enum(['fibonacci', 'simplified', 'tshirt', 'custom']),
    custom_scale: z.string().transform(v =>
        v.split(',').map(s => s.trim()).filter(Boolean)
    ),
})

const joinSessionSchema = z.object({
    name: z.string().min(1, 'Prénom requis').max(50),
    code: z.string().min(4, 'Code trop court').max(12).transform(v => v.toUpperCase()),
})

function generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export const actions: Actions = {
    create: async ({ request }) => {
        const form = await request.formData()
        const raw = {
            name: String(form.get('name') ?? '').trim(),
            session_name: String(form.get('session_name') ?? '').trim(),
            project: String(form.get('project') ?? '').trim(),
            scale: String(form.get('scale') ?? 'fibonacci'),
            custom_scale: String(form.get('custom_scale') ?? ''),
        }

        const parsed = createSessionSchema.safeParse(raw)
        if (!parsed.success) {
            const message = parsed.error.errors[0]?.message ?? 'Données invalides'
            return fail(400, { error: message })
        }

        const { name, session_name, project, scale, custom_scale } = parsed.data
        const sdk = createVotaPilota(ENDPOINT, 'pilota-admin-secret')
        const code = generateCode()

        const result = await (sdk.nhost.planning_sessions.mutation({
            code,
            name: session_name,
            project,
            scale,
            custom_scale: scale === 'custom' ? custom_scale : [],
            created_by: name,
        }) as Promise<NhostResult<Session>>)

        if (!result.data?.id) return fail(500, { error: 'Erreur lors de la création de la session' })

        await (sdk.nhost.planning_participants.mutation({
            session_id: result.data.id,
            name,
        }) as Promise<unknown>)

        redirect(303, `/session/${result.data.code}?name=${encodeURIComponent(name)}`)
    },

    join: async ({ request }) => {
        const form = await request.formData()
        const raw = {
            name: String(form.get('name') ?? '').trim(),
            code: String(form.get('code') ?? '').trim(),
        }

        const parsed = joinSessionSchema.safeParse(raw)
        if (!parsed.success) {
            const message = parsed.error.errors[0]?.message ?? 'Données invalides'
            return fail(400, { error: message })
        }

        const { name, code } = parsed.data
        const sdk = createVotaPilota(ENDPOINT, 'pilota-admin-secret')
        const result = await (sdk.nhost.planning_sessions.query({
            where: { code: { _eq: code } },
        }) as Promise<NhostResult<{ planning_sessions: Session[] }>>)

        const sessions = result.data?.planning_sessions ?? []
        if (sessions.length === 0) return fail(404, { error: `Session "${code}" introuvable` })

        const session = sessions[0]

        try {
            await (sdk.nhost.planning_participants.mutation({ session_id: session.id, name }) as Promise<unknown>)
        } catch {
            // Participant already exists — ignore
        }

        redirect(303, `/session/${session.code}?name=${encodeURIComponent(name)}`)
    },
}
