import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { createVotaPilota } from '$lib/technical/sdk/index.ts'
import type { Session, Task, Participant, Vote } from '$lib/technical/types'

// Both vars are SERVER-ONLY (no PUBLIC_ prefix) — this module only runs on the
// server, so the admin secret never reaches the browser.
const ENDPOINT = process.env.NHOST_GRAPHQL_URL ?? 'http://host.docker.internal:8080/v1/graphql'
const ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET

export const load: PageServerLoad = async ({ params, url }) => {
    const code = params.id.toUpperCase()
    const participantName = url.searchParams.get('name') ?? ''

    const sdk = createVotaPilota(ENDPOINT, ADMIN_SECRET)

    const sessionResult = await sdk.nhost.planning_sessions.query<{ planning_sessions: Session[] }>({
        where: { code: { _eq: code } },
    })

    const sessions = sessionResult.data?.planning_sessions ?? []
    if (sessions.length === 0) error(404, `Session "${code}" introuvable`)

    const session = sessions[0]
    const where = { where: { session_id: { _eq: session.id } } }

    const [tasksResult, participantsResult, votesResult] = await Promise.all([
        sdk.nhost.planning_tasks.query<{ planning_tasks: Task[] }>(where),
        sdk.nhost.planning_participants.query<{ planning_participants: Participant[] }>(where),
        sdk.nhost.planning_votes.query<{ planning_votes: Vote[] }>(where),
    ])

    const tasks: Task[] = (tasksResult.data?.planning_tasks ?? [])
        .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at))

    const participants: Participant[] = participantsResult.data?.planning_participants ?? []
    const votes: Vote[] = votesResult.data?.planning_votes ?? []

    return { session, tasks, participants, votes, participantName }
}
