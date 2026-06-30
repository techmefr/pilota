<script lang="ts">
    import { getTranslate } from '@tolgee/svelte'
    import { AVAILABLE_TAGS } from '$lib/technical/types'
    import type { useSession } from '$lib/functional/useSession.svelte.ts'

    let { s }: { s: ReturnType<typeof useSession> } = $props()

    const { t } = getTranslate()
</script>

<div class="overlay">
    <div class="modal modal-wide">
        <h3 class="modal-title">{$t('task.add_title')}</h3>
        <div class="field">
            <label for="task-title">{$t('task.title')} *</label>
            <input id="task-title" class="input" type="text" placeholder="US-123: …" bind:value={s.newTitle} />
        </div>
        <div class="field">
            <label for="task-desc">{$t('task.description')}</label>
            <input id="task-desc" class="input" type="text" placeholder="…" bind:value={s.newDescription} />
        </div>
        <div class="field">
            <label for="task-link">{$t('task.link')}</label>
            <input id="task-link" class="input" type="text" placeholder="https://…" bind:value={s.newLink} />
        </div>
        <div class="field">
            <label for="task-image">{$t('task.image')}</label>
            <input id="task-image" class="input" type="text" placeholder="https://…" bind:value={s.newImage} />
        </div>
        <div class="field">
            <span class="field-label">{$t('task.tags')}</span>
            <div class="tag-picker">
                {#each AVAILABLE_TAGS as tag}
                    <button type="button" class="tag-pill" class:tag-selected={s.newTags.includes(tag)} onclick={() => s.toggleTag(tag)}>{tag}</button>
                {/each}
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-outline" onclick={() => (s.showAddTask = false)}>{$t('task.cancel')}</button>
            <button class="btn-primary" onclick={s.addTask} disabled={!s.newTitle.trim() || s.addingTask}>
                {s.addingTask ? $t('task.adding') : $t('task.add')}
            </button>
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

    .modal-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        margin-top: -0.5rem;
    }

    .modal-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.07em;
    }

    .field-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.07em;
    }

    .input {
        background: var(--bg);
        border: 1.5px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.75rem 1rem;
        color: var(--text);
        font-size: 1rem;
        outline: none;
        transition: border-color 0.15s;
        width: 100%;
    }

    .input:focus { border-color: var(--primary); }

    .tag-picker {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tag-pill {
        font-size: 0.8125rem;
        font-weight: 700;
        padding: 0.3rem 0.75rem;
        border-radius: 99px;
        border: 1.5px solid var(--border);
        background: var(--bg);
        color: var(--muted);
        cursor: pointer;
        transition: all 0.15s;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .tag-selected {
        border-color: var(--primary);
        color: var(--primary);
        background: var(--primary-dim);
    }

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

    @media (prefers-reduced-motion: reduce) {
        .modal { animation: none; }
        .btn-primary, .btn-outline { transition: opacity 0.1s, background 0.1s; }
    }

    @media print {
        .overlay { display: none; }
    }
</style>
