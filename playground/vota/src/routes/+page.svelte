<script lang="ts">
    import { enhance } from '$app/forms'
    import { t, lang } from '$lib/technical/i18n'
    import { SCALE_LABELS } from '$lib/technical/types'

    let { form } = $props()

    let mode: 'home' | 'create' | 'join' = $state('home')
    let name = $state('')
    let sessionName = $state('')
    let project = $state('')
    let scale = $state('fibonacci')
    let customScale = $state('')
    let code = $state('')
    let loading = $state(false)

    const scales = Object.entries(SCALE_LABELS) as [string, string][]
</script>

<div class="page">
    <div class="card">
        <div class="logo">
            <div class="logo-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <rect x="4" y="6" width="28" height="36" rx="4" fill="var(--primary)" opacity="0.15"/>
                    <rect x="4" y="6" width="28" height="36" rx="4" stroke="var(--primary)" stroke-width="2"/>
                    <text x="11" y="22" font-size="11" font-weight="700" fill="var(--primary)" font-family="var(--font)">A</text>
                    <text x="9" y="36" font-size="9" fill="var(--primary)" font-family="var(--font)">♠</text>
                    <rect x="16" y="14" width="28" height="36" rx="4" fill="var(--surface-2)" stroke="var(--border)" stroke-width="2"/>
                    <text x="23" y="30" font-size="11" font-weight="700" fill="var(--text-secondary)" font-family="var(--font)">K</text>
                    <text x="21" y="44" font-size="9" fill="var(--text-secondary)" font-family="var(--font)">♥</text>
                </svg>
            </div>
            <span class="logo-text">{$t('app.name')}</span>
            <span class="logo-sub">{$t('app.tagline')}</span>
        </div>

        {#if form?.error}
            <div class="error-banner">{form.error}</div>
        {/if}

        <div class="field">
            <label for="global-name">{$t('home.your_name')}</label>
            <input
                id="global-name"
                type="text"
                placeholder="Alice"
                bind:value={name}
                autocomplete="given-name"
                class="input"
            />
        </div>

        {#if mode === 'home'}
            <div class="actions">
                <button class="btn-primary" onclick={() => (mode = 'create')} disabled={!name.trim()}>
                    {$t('home.create')}
                </button>
                <button class="btn-outline" onclick={() => (mode = 'join')} disabled={!name.trim()}>
                    {$t('home.join')}
                </button>
            </div>
            <a class="hub-link" href="http://localhost:9999">{$t('home.hub')}</a>

        {:else if mode === 'create'}
            <form method="POST" action="?/create" use:enhance={() => {
                loading = true
                return ({ update }) => { update(); loading = false }
            }}>
                <input type="hidden" name="name" value={name} />

                <div class="field">
                    <label for="session-name">{$t('home.session_name')}</label>
                    <input id="session-name" name="session_name" type="text" placeholder="Sprint 42" bind:value={sessionName} required class="input" />
                </div>

                <div class="field">
                    <label for="project">
                        {$t('home.project')}
                        <span class="label-hint">({$t('home.optional')})</span>
                    </label>
                    <input id="project" name="project" type="text" placeholder={$t('home.project_placeholder')} bind:value={project} class="input" />
                </div>

                <div class="field">
                    <fieldset class="scale-fieldset">
                        <legend>{$t('home.scale')}</legend>
                        <div class="scale-options">
                            {#each scales as [key, label]}
                                <label class="scale-option" class:scale-selected={scale === key}>
                                    <input type="radio" name="scale" value={key} bind:group={scale} class="sr-only" />
                                    {label}
                                </label>
                            {/each}
                        </div>
                    </fieldset>
                </div>

                {#if scale === 'custom'}
                    <div class="field">
                        <label for="custom-scale">
                            {$t('home.custom_scale')}
                            <span class="label-hint">({$t('home.custom_scale_hint')})</span>
                        </label>
                        <input id="custom-scale" name="custom_scale" type="text" placeholder="S, M, L, XL, ?" bind:value={customScale} class="input" />
                    </div>
                {/if}

                <div class="form-actions">
                    <button type="button" class="btn-outline btn-sm" onclick={() => (mode = 'home')}>{$t('home.back')}</button>
                    <button type="submit" class="btn-primary btn-grow" disabled={loading || !sessionName.trim()}>
                        {loading ? $t('home.creating') : $t('home.start')}
                    </button>
                </div>
            </form>

        {:else if mode === 'join'}
            <form method="POST" action="?/join" use:enhance={() => {
                loading = true
                return ({ update }) => { update(); loading = false }
            }}>
                <input type="hidden" name="name" value={name} />

                <div class="field">
                    <label for="join-code">{$t('home.session_code')}</label>
                    <input
                        id="join-code"
                        name="code"
                        type="text"
                        placeholder="ABC123"
                        bind:value={code}
                        maxlength="6"
                        class="input input-code"
                        required
                    />
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-outline btn-sm" onclick={() => (mode = 'home')}>{$t('home.back')}</button>
                    <button type="submit" class="btn-primary btn-grow" disabled={loading || code.trim().length < 6}>
                        {loading ? $t('home.joining') : $t('home.join')}
                    </button>
                </div>
            </form>
        {/if}
    </div>
</div>

<style>
    .page {
        min-height: calc(100vh - var(--navbar-height));
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg);
        padding: 2rem;
    }

    .card {
        width: 100%;
        max-width: 460px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 2.75rem;
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
        box-shadow: var(--shadow);
        animation: cardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes cardIn {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .logo {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
    }

    .logo-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.35rem;
    }

    .logo-text {
        font-size: 3.5rem;
        font-weight: 900;
        color: var(--text);
        letter-spacing: -0.06em;
        line-height: 0.95;
    }

    .logo-sub {
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: 0.01em;
        margin-top: 0.25rem;
    }

    .error-banner {
        background: var(--red-dim);
        border: 1px solid var(--red);
        color: var(--red);
        border-radius: var(--radius-sm);
        padding: 0.75rem 1rem;
        font-size: 0.9375rem;
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

    .label-hint {
        font-weight: 400;
        text-transform: none;
        letter-spacing: 0;
        color: var(--muted);
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

    .input:focus {
        border-color: var(--primary);
    }

    .input-code {
        text-transform: uppercase;
        font-size: 1.75rem;
        font-weight: 800;
        letter-spacing: 0.25em;
        text-align: center;
        font-variant-numeric: tabular-nums;
    }

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

    .scale-fieldset {
        border: none;
        padding: 0;
        margin: 0;
    }

    .scale-fieldset legend {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.07em;
        margin-bottom: 0.5rem;
    }

    .scale-options {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .scale-option {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: none;
        letter-spacing: 0;
        padding: 0.4rem 0.875rem;
        border: 1.5px solid var(--border);
        border-radius: 99px;
        background: var(--bg);
        transition: border-color 0.15s, color 0.15s;
    }

    .scale-selected {
        border-color: var(--primary);
        color: var(--primary);
        background: var(--primary-dim);
    }

    .scale-option:hover:not(.scale-selected) {
        border-color: var(--muted);
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .form-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .btn-primary {
        background: var(--primary);
        color: var(--on-primary);
        border: none;
        border-radius: var(--radius-sm);
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.15s, transform 0.1s;
        text-align: center;
    }

    .btn-primary:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    .btn-primary:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        transform: none;
    }

    .btn-outline {
        background: transparent;
        color: var(--text);
        border: 1.5px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.875rem 1.25rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: border-color 0.15s;
        white-space: nowrap;
    }

    .btn-outline:hover:not(:disabled) {
        border-color: var(--muted);
    }

    .btn-outline:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .btn-sm {
        padding: 0.6rem 1rem;
        font-size: 0.9375rem;
        flex-shrink: 0;
    }

    .btn-grow {
        flex: 1;
    }

    .hub-link {
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .hub-link:hover {
        color: var(--text);
        text-decoration: none;
    }

    .btn-primary:active:not(:disabled) {
        transform: scale(0.97);
        opacity: 1;
    }

    .btn-outline:active:not(:disabled) {
        transform: scale(0.97);
    }

    .scale-option:active {
        transform: scale(0.95);
    }

    @media (prefers-reduced-motion: reduce) {
        .card { animation: none; }
        .btn-primary, .btn-outline, .scale-option { transition: none; }
        .input { transition: none; }
    }
</style>
