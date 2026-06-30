<script lang="ts">
    import { getTranslate } from '@tolgee/svelte'
    import type { useSession } from '$lib/functional/useSession.svelte.ts'

    let { s }: { s: ReturnType<typeof useSession> } = $props()

    const { t } = getTranslate()
</script>

<div class="overlay">
    <div class="modal">
        <p class="modal-label">{$t('join.session')}</p>
        <h2 class="modal-title">{s.session.name}</h2>
        <label for="join-name" class="sr-only">{$t('home.your_name')}</label>
        <input id="join-name" class="input" type="text" placeholder="Alice" bind:value={s.nameInput} onkeydown={(e) => e.key === 'Enter' && s.joinSession()} />
        <button class="btn-primary" onclick={s.joinSession} disabled={!s.nameInput.trim()}>{$t('join.join')}</button>
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

    .modal-label {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--muted);
    }

    .modal-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text);
        margin-top: -0.5rem;
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

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        .modal { animation: none; }
        .btn-primary { transition: opacity 0.1s, background 0.1s; }
    }

    @media print {
        .overlay { display: none; }
    }
</style>
