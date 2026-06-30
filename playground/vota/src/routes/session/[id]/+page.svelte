<script lang="ts">
    import { onMount } from 'svelte'
    import { useSession } from '$lib/functional/useSession.svelte.ts'
    import { tolgee, LANG_LABELS, type Lang } from '$lib/technical/i18n'
    import JoinPromptModal from '$lib/functional/components/JoinPromptModal.svelte'
    import SessionEndModal from '$lib/functional/components/SessionEndModal.svelte'
    import ExportModal from '$lib/functional/components/ExportModal.svelte'
    import AddTaskModal from '$lib/functional/components/AddTaskModal.svelte'
    import SessionHeader from '$lib/functional/components/SessionHeader.svelte'
    import TaskSidebar from '$lib/functional/components/TaskSidebar.svelte'
    import VotingZone from '$lib/functional/components/VotingZone.svelte'
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()

    const s = useSession(data)
    const langs = Object.entries(LANG_LABELS) as [Lang, string][]

    let currentLang = $state<Lang>('fr')

    onMount(() => {
        currentLang = (tolgee.getLanguage() ?? 'fr') as Lang
    })

    function setLang(l: Lang) {
        tolgee.changeLanguage(l)
        currentLang = l
    }

    const FONT_SIZE_OPTIONS = [
        { label: 'A−', value: 15 },
        { label: 'A',  value: 17 },
        { label: 'A+', value: 19 },
        { label: 'A++', value: 21 },
    ]
</script>

<!-- Overlay: join prompt -->
{#if s.showNamePrompt}
    <JoinPromptModal {s} />
{/if}

<!-- Overlay: session complete -->
{#if s.showSessionEnd}
    <SessionEndModal {s} />
{/if}

<!-- Overlay: export -->
{#if s.showExport}
    <ExportModal {s} />
{/if}

<!-- Overlay: add task -->
{#if s.showAddTask}
    <AddTaskModal {s} />
{/if}

<div class="app">
    <SessionHeader {s} {currentLang} {setLang} {langs} fontSizeOptions={FONT_SIZE_OPTIONS} />

    <div class="progress-bar">
        <div class="progress-fill" style:width="{s.tasks.length > 0 ? (s.estimatedCount / s.tasks.length) * 100 : 0}%"></div>
    </div>

    <div class="main">
        <TaskSidebar {s} />
        <VotingZone {s} />
    </div>
</div>

<style>
    /* ── App shell ────────────────────────────────── */
    .app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
    }

    /* ── Progress bar ─────────────────────────────── */
    .progress-bar {
        height: 2px;
        background: var(--border);
        flex-shrink: 0;
    }

    .progress-fill {
        height: 100%;
        background: var(--primary);
        transition: width 0.4s ease;
    }

    /* ── Main layout ──────────────────────────────── */
    .main {
        display: flex;
        flex: 1;
        overflow: hidden;
    }
</style>
