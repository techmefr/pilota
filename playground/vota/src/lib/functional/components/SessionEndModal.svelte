<script lang="ts">
    import type { useSession } from '$lib/functional/useSession.svelte.ts'

    let { s }: { s: ReturnType<typeof useSession> } = $props()
</script>

<div class="overlay" role="dialog" aria-modal="true" aria-label="Session terminée">
    <div class="modal modal-wide session-end-modal">
        <div class="session-end-header">
            <div class="session-end-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
                <h2 class="session-end-title">Session terminée</h2>
                <p class="session-end-sub">{s.session.name} · {s.tasks.length} tâches · {s.totalPoints} pts</p>
            </div>
        </div>

        <div class="session-end-tasks">
            {#each s.tasks as task}
                <div class="end-task-row">
                    <span class="end-task-title">{task.title}</span>
                    <span class="end-task-estimate" class:end-task-no-estimate={!task.estimate}>
                        {task.estimate ?? '–'}
                    </span>
                </div>
            {/each}
        </div>

        <div class="session-end-stats">
            <div class="end-stat">
                <span class="end-stat-label">Tâches estimées</span>
                <strong class="end-stat-value">{s.estimatedCount} / {s.tasks.length}</strong>
            </div>
            <div class="end-stat">
                <span class="end-stat-label">Total story points</span>
                <strong class="end-stat-value end-stat-primary">{s.totalPoints}</strong>
            </div>
            <div class="end-stat">
                <span class="end-stat-label">Participants</span>
                <strong class="end-stat-value">{s.participants.length}</strong>
            </div>
        </div>

        <div class="session-end-actions">
            <button class="export-btn" onclick={s.exportCSV}>Export CSV</button>
            <button class="export-btn" onclick={s.exportJSON}>Export JSON</button>
            <button class="export-btn" onclick={s.copyJira}>Copier Jira</button>
            <a class="btn-outline" href="/" style="text-align:center">← Accueil</a>
            <button class="btn-primary" onclick={() => { s.showSessionEnd = false }}>Continuer</button>
        </div>
    </div>
</div>

<style>
    @keyframes modalIn {
        from { opacity: 0; transform: scale(0.96) translateY(10px); }
        to   { opacity: 1; transform: scale(1)    translateY(0); }
    }

    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        padding: 1.5rem;
    }

    .modal {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 2rem;
        width: 100%;
        max-width: 420px;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        box-shadow: var(--shadow);
        animation: modalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .modal-wide { max-width: 520px; }

    .export-btn {
        background: var(--surface-2);
        border: 1.5px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.875rem;
        color: var(--text);
        font-weight: 600;
        font-size: 0.9375rem;
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s;
    }

    .export-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
    }

    .export-btn:active { transform: scale(0.95); }

    .btn-primary {
        background: var(--primary);
        color: var(--on-primary);
        border: none;
        border-radius: var(--radius-sm);
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.15s, transform 0.1s;
        white-space: nowrap;
    }

    .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
    .btn-primary:active:not(:disabled) { transform: scale(0.97); }

    .btn-outline {
        background: transparent;
        color: var(--text);
        border: 1.5px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.75rem 1.25rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: border-color 0.15s;
        text-decoration: none;
        white-space: nowrap;
    }

    .btn-outline:hover { border-color: var(--muted); }
    .btn-outline:active:not(:disabled) { transform: scale(0.97); }

    .session-end-modal { max-width: 560px; gap: 1.25rem; }

    .session-end-header {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .session-end-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: var(--primary-dim);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .session-end-title { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.03em; }
    .session-end-sub   { font-size: 1rem; color: var(--text-secondary); margin-top: 0.15rem; }

    .session-end-tasks {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        max-height: 240px;
        overflow-y: auto;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.5rem;
    }
    .end-task-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.4rem 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.9375rem;
    }
    .end-task-row:nth-child(odd) { background: var(--surface-2); }
    .end-task-title { color: var(--text); flex: 1; margin-right: 0.75rem; }
    .end-task-estimate { font-weight: 700; color: var(--primary); min-width: 2rem; text-align: right; }
    .end-task-no-estimate { color: var(--muted); }

    .session-end-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
    }
    .end-stat {
        background: var(--surface-2);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.75rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    .end-stat-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: var(--muted); }
    .end-stat-value { font-size: 2rem; font-weight: 900; letter-spacing: -0.04em; }
    .end-stat-primary { color: var(--primary); }

    .session-end-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    .session-end-actions .btn-primary { margin-left: auto; }

    @media (prefers-reduced-motion: reduce) {
        .modal { animation: none; }
        .btn-primary, .btn-outline, .export-btn { transition: opacity 0.1s, background 0.1s; }
    }

    @media print {
        .overlay { display: none; }
    }
</style>
