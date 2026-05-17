import { onMount, onDestroy, untrack } from 'svelte'
import { env } from '$env/dynamic/public'
import { createVotaPilota } from '$lib/technical/sdk/index.ts'
import { layoutBarVisible } from '$lib/technical/layout.ts'
import { toCSV, toJSON, toJiraText, downloadFile, printAsPDF } from '$lib/technical/export.ts'
import { SCALES, AVAILABLE_TAGS } from '$lib/technical/types.ts'
import type { Session, Task, Participant, Vote } from '$lib/technical/types.ts'

interface SessionData {
    session: Session
    tasks: Task[]
    participants: Participant[]
    votes: Vote[]
    participantName: string
}

export function useSession(data: SessionData) {
    const endpoint = env.PUBLIC_NHOST_GRAPHQL_URL ?? 'http://localhost:8080/v1/graphql'
    const sdk = createVotaPilota(endpoint)
    let unsubscribers: Array<() => void> = []

    let session = $state<Session>(untrack(() => ({ ...data.session })))
    let tasks = $state<Task[]>(untrack(() => [...data.tasks]))
    let participants = $state<Participant[]>(untrack(() => [...data.participants]))
    let votes = $state<Vote[]>(untrack(() => [...data.votes]))
    let myName = $state(untrack(() => data.participantName))

    let showAddTask = $state(false)
    let showExport = $state(false)
    let showSessionEnd = $state(false)
    let showNamePrompt = $state(untrack(() => data.participantName === ''))
    let nameInput = $state('')
    let finalEstimate = $state('')
    let copied = $state(false)
    let profileOpen = $state(false)
    let profileRef = $state<HTMLDivElement | null>(null)

    let newTitle = $state('')
    let newDescription = $state('')
    let newLink = $state('')
    let newImage = $state('')
    let newTags = $state<string[]>([])
    let addingTask = $state(false)

    const currentTask = $derived(tasks.find(t => t.id === session.current_task_id) ?? null)
    const currentVotes = $derived(votes.filter(v => v.task_id === session.current_task_id))
    const myVote = $derived(currentVotes.find(v => v.participant === myName) ?? null)
    const allRevealed = $derived(currentVotes.length > 0 && currentVotes.every(v => v.revealed))
    const allVoted = $derived(participants.length > 0 && currentVotes.length >= participants.length && currentVotes.every(v => v.value !== null))
    const cards = $derived(session.scale === 'custom' ? session.custom_scale : (SCALES[session.scale] ?? SCALES.fibonacci))
    const isCreator = $derived(myName === session.created_by)
    const estimatedCount = $derived(tasks.filter(t => t.estimate).length)
    const sessionComplete = $derived(tasks.length > 0 && estimatedCount === tasks.length)
    const totalPoints = $derived(tasks.reduce((s, t) => s + (isNaN(Number(t.estimate)) ? 0 : Number(t.estimate)), 0))

    const voteDistribution = $derived((): Array<{ value: string; count: number; pct: number }> => {
        if (!allRevealed) return []
        const map = new Map<string, number>()
        for (const v of currentVotes) {
            if (v.value) map.set(v.value, (map.get(v.value) ?? 0) + 1)
        }
        const max = Math.max(...map.values())
        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([value, count]) => ({ value, count, pct: Math.round((count / max) * 100) }))
    })

    const suggestedEstimate = $derived((): string => {
        if (!allRevealed) return ''
        const numeric = currentVotes
            .filter(v => v.value && !isNaN(Number(v.value)))
            .map(v => Number(v.value))
        if (!numeric.length) return ''
        const avg = numeric.reduce((a, b) => a + b, 0) / numeric.length
        const scaleNums = cards.filter(c => !isNaN(Number(c))).map(Number).sort((a, b) => a - b)
        if (!scaleNums.length) return ''
        const higher = scaleNums.filter(c => c >= avg)
        return String(higher.length > 0 ? higher[0] : scaleNums[scaleNums.length - 1])
    })

    const consensusLevel = $derived((): 'unanimous' | 'near' | 'split' => {
        if (!allRevealed) return 'split'
        const numeric = currentVotes.filter(v => v.value && !isNaN(Number(v.value))).map(v => Number(v.value))
        if (!numeric.length) return 'split'
        const min = Math.min(...numeric), max = Math.max(...numeric)
        if (min === max) return 'unanimous'
        const scaleNums = cards.filter(c => !isNaN(Number(c))).map(Number).sort((a, b) => a - b)
        const minIdx = scaleNums.findIndex(n => n >= min)
        const maxIdx = scaleNums.findIndex(n => n >= max)
        return maxIdx - minIdx <= 1 ? 'near' : 'split'
    })

    function handleSessionData(payload: unknown) {
        const d = (payload as { data?: { planning_sessions?: Session[] } })?.data
        if (d?.planning_sessions?.length) session = { ...d.planning_sessions[0] }
    }

    function handleTasksData(payload: unknown) {
        const d = (payload as { data?: { planning_tasks?: Task[] } })?.data
        if (d?.planning_tasks) {
            tasks = [...d.planning_tasks].sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at))
        }
    }

    function handleParticipantsData(payload: unknown) {
        const d = (payload as { data?: { planning_participants?: Participant[] } })?.data
        if (d?.planning_participants) participants = [...d.planning_participants]
    }

    function handleVotesData(payload: unknown) {
        const d = (payload as { data?: { planning_votes?: Vote[] } })?.data
        if (d?.planning_votes) votes = [...d.planning_votes]
    }

    onMount(() => {
        layoutBarVisible.set(false)

        const where = { where: { session_id: { _eq: session.id } } }

        unsubscribers.push(
            sdk.nhost.planning_sessions.subscription({ where: { id: { _eq: session.id } } }, (_e: string, d: unknown) => handleSessionData(d)) as () => void,
            sdk.nhost.planning_tasks.subscription(where, (_e: string, d: unknown) => handleTasksData(d)) as () => void,
            sdk.nhost.planning_participants.subscription(where, (_e: string, d: unknown) => handleParticipantsData(d)) as () => void,
            sdk.nhost.planning_votes.subscription(where, (_e: string, d: unknown) => handleVotesData(d)) as () => void,
        )

        function handleOutsideClick(e: MouseEvent) {
            if (profileRef && !profileRef.contains(e.target as Node)) profileOpen = false
        }
        document.addEventListener('mousedown', handleOutsideClick)
        unsubscribers.push(() => document.removeEventListener('mousedown', handleOutsideClick))
    })

    onDestroy(() => {
        unsubscribers.forEach(u => u())
        layoutBarVisible.set(true)
    })

    $effect(() => {
        if (allVoted && !allRevealed && currentTask && currentVotes.length > 0) {
            revealVotes()
            playSound('reveal')
        }
    })

    $effect(() => {
        if (allRevealed && suggestedEstimate() && !finalEstimate) {
            finalEstimate = suggestedEstimate()
        }
    })

    $effect(() => {
        if (sessionComplete && !showSessionEnd) showSessionEnd = true
    })

    function playSound(type: 'vote' | 'reveal' | 'validate') {
        if (typeof window === 'undefined') return
        try {
            const ctx = new AudioContext()
            const now = ctx.currentTime
            if (type === 'vote') {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.connect(gain); gain.connect(ctx.destination)
                osc.frequency.value = 523; osc.type = 'sine'
                gain.gain.setValueAtTime(0.1, now)
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
                osc.start(now); osc.stop(now + 0.1)
            } else if (type === 'reveal') {
                ;[523, 659, 784].forEach((freq, i) => {
                    const osc = ctx.createOscillator()
                    const gain = ctx.createGain()
                    osc.connect(gain); gain.connect(ctx.destination)
                    osc.frequency.value = freq; osc.type = 'sine'
                    const t = now + i * 0.07
                    gain.gain.setValueAtTime(0.09, t)
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
                    osc.start(t); osc.stop(t + 0.35)
                })
            } else if (type === 'validate') {
                ;[784, 1047].forEach((freq, i) => {
                    const osc = ctx.createOscillator()
                    const gain = ctx.createGain()
                    osc.connect(gain); gain.connect(ctx.destination)
                    osc.frequency.value = freq; osc.type = 'sine'
                    const t = now + i * 0.08
                    gain.gain.setValueAtTime(0.09, t)
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
                    osc.start(t); osc.stop(t + 0.15)
                })
            }
        } catch { /* audio blocked by browser policy */ }
    }

    async function joinSession() {
        if (!nameInput.trim()) return
        myName = nameInput.trim()
        try { await (sdk.nhost.planning_participants.mutation({ session_id: session.id, name: myName }) as Promise<unknown>) } catch { /* already exists */ }
        showNamePrompt = false
    }

    async function selectTask(task: Task) {
        await (sdk.nhost.planning_sessions.updateById(
            { id: session.id, data: { current_task_id: task.id } },
        ) as Promise<unknown>)
        finalEstimate = task.estimate ?? ''
    }

    async function vote(value: string) {
        if (!myName || !session.current_task_id) return
        playSound('vote')
        await (sdk.nhost.planning_votes.upsert({
            data: { task_id: session.current_task_id, session_id: session.id, participant: myName, value },
            conflictConstraint: 'planning_votes_task_id_participant_key',
            updateColumns: ['value'],
        }) as Promise<unknown>)
    }

    async function revealVotes() {
        if (!session.current_task_id) return
        playSound('reveal')
        await (sdk.nhost.planning_votes.updateWhere({
            where: { task_id: { _eq: session.current_task_id } },
            data: { revealed: true },
        }) as Promise<unknown>)
    }

    async function setEstimate() {
        if (!currentTask || !finalEstimate.trim()) return
        playSound('validate')
        await (sdk.nhost.planning_tasks.updateById({
            id: currentTask.id,
            data: { estimate: finalEstimate.trim() },
        }) as Promise<unknown>)
        finalEstimate = ''
        const currentIdx = tasks.findIndex(t => t.id === currentTask!.id)
        const next = tasks.slice(currentIdx + 1).find(t => !t.estimate)
            ?? tasks.slice(0, currentIdx).find(t => !t.estimate)
        if (next) await selectTask(next)
    }

    async function addTask() {
        if (!newTitle.trim() || addingTask) return
        addingTask = true
        const nextOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.sort_order)) + 1 : 0
        await (sdk.nhost.planning_tasks.mutation({
            session_id: session.id,
            title: newTitle.trim(),
            description: newDescription.trim(),
            link: newLink.trim(),
            image: newImage.trim(),
            tags: newTags,
            added_by: myName,
            sort_order: nextOrder,
        }) as Promise<unknown>)
        newTitle = ''; newDescription = ''; newLink = ''; newImage = ''; newTags = []
        addingTask = false
        showAddTask = false
    }

    function toggleTag(tag: string) {
        newTags = newTags.includes(tag) ? newTags.filter(t => t !== tag) : [...newTags, tag]
    }

    async function copyCode() {
        await navigator.clipboard.writeText(session.code)
        copied = true
        setTimeout(() => (copied = false), 2000)
    }

    async function shareSession() {
        const url = window.location.href
        if (navigator.share) {
            try { await navigator.share({ title: `Vota – ${session.name}`, url }) } catch { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(url)
            copied = true
            setTimeout(() => (copied = false), 2000)
        }
    }

    function exportCSV() {
        downloadFile(toCSV({ session, tasks: tasks.map(t => ({ ...t, tags: t.tags as string[] })), votes }), `vota-${session.code}.csv`, 'text/csv;charset=utf-8')
    }

    function exportJSON() {
        downloadFile(toJSON({ session, tasks: tasks.map(t => ({ ...t, tags: t.tags as string[] })), votes }), `vota-${session.code}.json`, 'application/json')
    }

    function copyJira() {
        navigator.clipboard.writeText(toJiraText(tasks))
        showExport = false
    }

    function getUserColorIndex(name: string): number {
        let h = 0
        for (let i = 0; i < name.length; i++) h = Math.imul(31, h) + name.charCodeAt(i) | 0
        return Math.abs(h) % 10
    }

    function getVoteAverage(): string {
        const numeric = currentVotes.filter(v => v.value && !isNaN(Number(v.value))).map(v => Number(v.value))
        if (!numeric.length) return '–'
        return (numeric.reduce((a, b) => a + b, 0) / numeric.length).toFixed(1)
    }

    return {
        get session() { return session },
        get tasks() { return tasks },
        get participants() { return participants },
        get votes() { return votes },
        get myName() { return myName },
        get showAddTask() { return showAddTask },
        set showAddTask(v: boolean) { showAddTask = v },
        get showExport() { return showExport },
        set showExport(v: boolean) { showExport = v },
        get showSessionEnd() { return showSessionEnd },
        set showSessionEnd(v: boolean) { showSessionEnd = v },
        get showNamePrompt() { return showNamePrompt },
        get nameInput() { return nameInput },
        set nameInput(v: string) { nameInput = v },
        get finalEstimate() { return finalEstimate },
        set finalEstimate(v: string) { finalEstimate = v },
        get copied() { return copied },
        get profileOpen() { return profileOpen },
        set profileOpen(v: boolean) { profileOpen = v },
        get profileRef() { return profileRef },
        set profileRef(v: HTMLDivElement | null) { profileRef = v },
        get newTitle() { return newTitle },
        set newTitle(v: string) { newTitle = v },
        get newDescription() { return newDescription },
        set newDescription(v: string) { newDescription = v },
        get newLink() { return newLink },
        set newLink(v: string) { newLink = v },
        get newImage() { return newImage },
        set newImage(v: string) { newImage = v },
        get newTags() { return newTags },
        get addingTask() { return addingTask },
        get currentTask() { return currentTask },
        get currentVotes() { return currentVotes },
        get myVote() { return myVote },
        get allRevealed() { return allRevealed },
        get cards() { return cards },
        get isCreator() { return isCreator },
        get estimatedCount() { return estimatedCount },
        get sessionComplete() { return sessionComplete },
        get totalPoints() { return totalPoints },
        voteDistribution,
        suggestedEstimate,
        consensusLevel,
        AVAILABLE_TAGS,
        joinSession,
        selectTask,
        vote,
        revealVotes,
        setEstimate,
        addTask,
        toggleTag,
        copyCode,
        shareSession,
        exportCSV,
        exportJSON,
        copyJira,
        printAsPDF,
        getUserColorIndex,
        getVoteAverage,
    }
}
