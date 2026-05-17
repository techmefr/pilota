import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { createVotaPilota } from '$lib/technical/sdk/index.ts'
import type { NhostResult } from '$lib/technical/sdk/index.ts'
import type { Session, Task, Participant, Vote } from '$lib/technical/types'

const ENDPOINT = process.env.NHOST_GRAPHQL_URL ?? 'http://host.docker.internal:8080/v1/graphql'

export const load: PageServerLoad = async ({ params, url }) => {
    const code = params.id.toUpperCase()
    const participantName = url.searchParams.get('name') ?? ''

    const sdk = createVotaPilota(ENDPOINT, 'pilota-admin-secret')

    const sessionResult = await (sdk.nhost.planning_sessions.query({
        where: { code: { _eq: code } },
    }) as Promise<NhostResult<{ planning_sessions: Session[] }>>)

    const sessions = sessionResult.data?.planning_sessions ?? []
    if (sessions.length === 0) error(404, `Session "${code}" introuvable`)

    const session = sessions[0]
    const where = { where: { session_id: { _eq: session.id } } }

    const [tasksResult, participantsResult, votesResult] = await Promise.all([
        sdk.nhost.planning_tasks.query(where) as Promise<NhostResult<{ planning_tasks: Task[] }>>,
        sdk.nhost.planning_participants.query(where) as Promise<NhostResult<{ planning_participants: Participant[] }>>,
        sdk.nhost.planning_votes.query(where) as Promise<NhostResult<{ planning_votes: Vote[] }>>,
    ])

    const tasks: Task[] = (tasksResult.data?.planning_tasks ?? [])
        .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at))

    const participants: Participant[] = participantsResult.data?.planning_participants ?? []
    const votes: Vote[] = votesResult.data?.planning_votes ?? []

    return { session, tasks, participants, votes, participantName }
}
