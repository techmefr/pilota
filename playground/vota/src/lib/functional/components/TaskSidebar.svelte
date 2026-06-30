<script lang="ts">
    import { getTranslate } from '@tolgee/svelte'
    import type { useSession } from '$lib/functional/useSession.svelte.ts'

    let { s }: { s: ReturnType<typeof useSession> } = $props()

    const { t } = getTranslate()
</script>

<aside class="sidebar">
    <div class="sidebar-header">
        <span class="sidebar-title">{$t('session.tasks')}</span>
        <div class="sidebar-meta">
            {#if s.tasks.length > 0}<span class="task-counter">{s.estimatedCount}/{s.tasks.length}</span>{/if}
            <button class="btn-add" onclick={() => (s.showAddTask = true)}>{$t('session.add')}</button>
        </div>
    </div>
    <div class="task-list">
        {#each s.tasks as task}
            <button
                class="task-card"
                class:task-active={task.id === s.session.current_task_id}
                class:task-done={!!task.estimate}
                onclick={() => s.selectTask(task)}
            >
                <div class="task-card-title">{task.title}</div>
                {#if task.tags?.length}
                    <div class="task-card-tags">
                        {#each task.tags as tag}<span class="tag">{tag}</span>{/each}
                    </div>
                {/if}
                <div class="task-card-footer">
                    <span class="task-author">{task.added_by}</span>
                    {#if task.estimate}
                        <span class="task-badge task-badge-done">{task.estimate}</span>
                    {:else}
                        <span class="task-badge task-badge-pending">{$t('vote.not_estimated')}</span>
                    {/if}
                </div>
            </button>
        {/each}
        {#if s.tasks.length === 0}
            <div class="empty-state">{$t('task.empty')}</div>
        {/if}
    </div>
</aside>

<style>
    @keyframes taskSlide {
        from { opacity: 0; transform: translateX(-8px); }
        to   { opacity: 1; transform: translateX(0); }
    }

    .sidebar {
        width: 280px;
        flex-shrink: 0;
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        background: var(--surface);
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.875rem 1rem;
        border-bottom: 1px solid var(--border);
    }

    .sidebar-title {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--muted);
    }

    .sidebar-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .task-counter {
        font-size: 0.6875rem;
        font-weight: 700;
        color: var(--muted);
        background: var(--surface-2);
        padding: 0.15rem 0.5rem;
        border-radius: 99px;
        border: 1px solid var(--border);
    }

    .btn-add {
        font-size: 0.8125rem;
        font-weight: 700;
        color: var(--primary);
        background: var(--primary-dim);
        border: none;
        border-radius: 0.375rem;
        padding: 0.25rem 0.625rem;
        cursor: pointer;
        transition: background 0.15s;
    }

    .btn-add:hover { background: var(--primary-hover); }

    .task-list {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .task-card {
        width: 100%;
        text-align: left;
        background: var(--bg);
        border: 1.5px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.875rem;
        cursor: pointer;
        transition: border-color 0.18s, transform 0.18s, box-shadow 0.18s;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        animation: taskSlide 0.2s ease both;
    }

    .task-card:nth-child(1)  { animation-delay: 0ms; }
    .task-card:nth-child(2)  { animation-delay: 30ms; }
    .task-card:nth-child(3)  { animation-delay: 60ms; }
    .task-card:nth-child(4)  { animation-delay: 90ms; }
    .task-card:nth-child(5)  { animation-delay: 120ms; }
    .task-card:nth-child(6)  { animation-delay: 150ms; }
    .task-card:nth-child(7)  { animation-delay: 180ms; }
    .task-card:nth-child(8)  { animation-delay: 210ms; }
    .task-card:nth-child(n+9) { animation-delay: 240ms; }

    .task-card:hover { border-color: var(--muted); transform: translateX(2px); }
    .task-active { border-color: var(--primary); background: var(--primary-dim); }
    .task-done { opacity: 0.65; }

    .task-card-title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--text);
        line-height: 1.35;
    }

    .task-card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
    }

    .tag {
        font-size: 0.6875rem;
        font-weight: 700;
        padding: 0.15rem 0.5rem;
        border-radius: 99px;
        background: var(--surface-2);
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border: 1px solid var(--border);
    }

    .task-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .task-author {
        font-size: 0.75rem;
        color: var(--muted);
    }

    .task-badge {
        font-size: 0.75rem;
        font-weight: 800;
        padding: 0.15rem 0.5rem;
        border-radius: 99px;
    }

    .task-badge-done {
        background: var(--green-dim);
        color: var(--green);
        border: 1px solid var(--green);
    }

    .task-badge-pending {
        background: var(--surface-2);
        color: var(--muted);
        border: 1px solid var(--border);
    }

    .empty-state {
        font-size: 0.9375rem;
        color: var(--muted);
        text-align: center;
        padding: 2.5rem 1rem;
        line-height: 1.5;
    }

    .task-card:active { transform: scale(0.99) !important; }

    @media (prefers-reduced-motion: reduce) {
        .task-card { animation: none; }
    }

    @media print {
        .sidebar { display: none; }
    }
</style>
