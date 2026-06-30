<script lang="ts">
    import { getTranslate } from '@tolgee/svelte'
    import type { useSession } from '$lib/functional/useSession.svelte.ts'

    let { s }: { s: ReturnType<typeof useSession> } = $props()

    const { t } = getTranslate()
</script>

<div class="overlay">
    <div class="modal">
        <h3 class="modal-title">{$t('export.title')}</h3>
        <div class="export-grid">
            <button class="export-btn" onclick={s.exportCSV}>{$t('export.csv')}</button>
            <button class="export-btn" onclick={s.exportJSON}>{$t('export.json')}</button>
            <button class="export-btn" onclick={s.copyJira}>{$t('export.jira')}</button>
            <button class="export-btn" onclick={() => { s.printAsPDF(); s.showExport = false }}>{$t('export.pdf')}</button>
        </div>
        <button class="btn-outline" onclick={() => (s.showExport = false)}>{$t('export.close')}</button>
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

    .modal-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        margin-top: -0.5rem;
    }

    .export-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.625rem;
    }

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
        .btn-outline, .export-btn { transition: opacity 0.1s, background 0.1s; }
    }

    @media print {
        .overlay { display: none; }
    }
</style>
