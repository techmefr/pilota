<script lang="ts">
    import { getTranslate } from '@tolgee/svelte'
    import { theme, fontSize } from '$lib/technical/theme'
    import type { Lang } from '$lib/technical/i18n'
    import type { useSession } from '$lib/functional/useSession.svelte.ts'

    let {
        s,
        currentLang,
        setLang,
        langs,
        fontSizeOptions,
    }: {
        s: ReturnType<typeof useSession>
        currentLang: Lang
        setLang: (l: Lang) => void
        langs: [Lang, string][]
        fontSizeOptions: { label: string; value: number }[]
    } = $props()

    const { t } = getTranslate()
</script>

<header class="header">
    <div class="header-left">
        <a href="/" class="brand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2.5"/>
                <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span class="brand-name">Vota</span>
        </a>
        <span class="topbar-sep">–</span>
        <span class="topbar-session-name">{s.session.name}</span>
        <button class="code-chip" onclick={s.copyCode}>
            <span class="code-text">{s.session.code}</span>
            {#if s.copied}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {:else}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            {/if}
        </button>
        <button class="share-btn" onclick={s.shareSession} title="Partager la session">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
        </button>
    </div>
    <div class="header-right">
        <div class="participants-bar">
            {#each s.participants as p}
                <span class="participant-avatar uc-{s.getUserColorIndex(p.name)}" class:avatar-me={p.name === s.myName} title={p.name}>
                    {p.name[0].toUpperCase()}
                </span>
            {/each}
        </div>
        <button class="btn-header" onclick={() => (s.showExport = true)}>{$t('session.export')}</button>
        {#if s.sessionComplete}
            <button class="btn-header btn-header-done" onclick={() => (s.showSessionEnd = true)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Terminée
            </button>
        {/if}
        <a class="btn-header" href="http://localhost:9999">{$t('home.hub')}</a>
        <div class="profile-wrap" bind:this={s.profileRef}>
            <button
                class="profile-btn"
                class:profile-open={s.profileOpen}
                onclick={() => (s.profileOpen = !s.profileOpen)}
                aria-label="Paramètres"
                aria-expanded={s.profileOpen}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
            </button>
            {#if s.profileOpen}
                <div class="profile-menu" role="menu">
                    <p class="profile-menu-label">Apparence</p>
                    <div class="theme-options">
                        <button
                            class="theme-opt"
                            class:theme-opt-active={$theme === 'light'}
                            onclick={() => { theme.set('light'); s.profileOpen = false }}
                            role="menuitem"
                        >
                            <span class="theme-swatch theme-swatch-light"></span>
                            Clair
                        </button>
                        <button
                            class="theme-opt"
                            class:theme-opt-active={$theme === 'dark'}
                            onclick={() => { theme.set('dark'); s.profileOpen = false }}
                            role="menuitem"
                        >
                            <span class="theme-swatch theme-swatch-dark"></span>
                            Sombre
                        </button>
                    </div>
                    <div class="menu-divider"></div>
                    <p class="profile-menu-label">Langue</p>
                    <div class="lang-options" role="group">
                        {#each langs as [code, label]}
                            <button
                                class="lang-opt"
                                class:lang-opt-active={currentLang === code}
                                onclick={() => setLang(code)}
                                title={label}
                                role="menuitem"
                            >
                                {code.toUpperCase()}
                            </button>
                        {/each}
                    </div>
                    <div class="menu-divider"></div>
                    <p class="profile-menu-label">Taille du texte</p>
                    <div class="fontsize-options">
                        {#each fontSizeOptions as opt}
                            <button
                                class="fontsize-opt"
                                class:fontsize-opt-active={$fontSize === opt.value}
                                onclick={() => fontSize.set(opt.value)}
                                role="menuitem"
                            >
                                {opt.label}
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</header>

<style>
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.25rem;
        height: var(--navbar-height);
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        gap: 1rem;
        flex-shrink: 0;
        position: sticky;
        top: 0;
        z-index: 200;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        min-width: 0;
        flex: 1;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        color: var(--text);
        text-decoration: none;
        flex-shrink: 0;
    }

    .brand:hover { color: var(--primary); text-decoration: none; }

    .brand-name {
        font-size: 1rem;
        font-weight: 900;
        letter-spacing: -0.04em;
    }

    .topbar-sep {
        color: var(--muted);
        font-size: 0.875rem;
        flex-shrink: 0;
    }

    .topbar-session-name {
        font-weight: 700;
        font-size: 0.9375rem;
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text);
        min-width: 0;
    }

    .share-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s;
        flex-shrink: 0;
    }

    .share-btn:hover { border-color: var(--primary); color: var(--primary); }

    .header-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
    }

    .profile-wrap { position: relative; }

    .profile-btn {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 1.5px solid var(--border);
        background: var(--surface-2);
        color: var(--muted);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
    }

    .profile-btn:hover,
    .profile-btn.profile-open {
        border-color: var(--primary);
        color: var(--primary);
        background: var(--primary-dim);
    }

    .profile-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 0.75rem;
        min-width: 200px;
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        z-index: 300;
        animation: menuIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes menuIn {
        from { opacity: 0; transform: translateY(-6px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)   scale(1); }
    }

    .profile-menu-label {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
        padding: 0 0.25rem;
    }

    .theme-options {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .theme-opt {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.625rem;
        border-radius: var(--radius-sm);
        border: none;
        background: transparent;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
        text-align: left;
    }

    .theme-opt:hover { background: var(--surface-2); color: var(--text); }

    .theme-opt-active {
        background: var(--primary-dim);
        color: var(--primary);
        font-weight: 600;
    }

    .theme-opt:active { transform: scale(0.96); }

    .menu-divider {
        height: 1px;
        background: var(--border);
        margin: 0.125rem 0;
    }

    .lang-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.25rem;
    }

    .lang-opt {
        padding: 0.4rem 0.25rem;
        border-radius: calc(var(--radius-sm) - 2px);
        border: 1.5px solid var(--border);
        background: transparent;
        color: var(--text-secondary);
        font-size: 0.8125rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        cursor: pointer;
        transition: background 0.12s, color 0.12s, border-color 0.12s;
        text-align: center;
    }

    .lang-opt:hover:not(.lang-opt-active) { background: var(--surface-2); color: var(--text); }

    .lang-opt-active {
        border-color: var(--primary);
        color: var(--primary);
        background: var(--primary-dim);
    }

    .lang-opt:active { transform: scale(0.94); }

    .theme-swatch {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .theme-swatch-light { background: #F8F9FA; border: 1.5px solid #DADCE0; }
    .theme-swatch-dark  { background: #202124; border: 1.5px solid #5F6368; }

    .fontsize-options {
        display: flex;
        gap: 0.25rem;
        background: var(--surface-2);
        border-radius: var(--radius-sm);
        padding: 0.2rem;
    }

    .fontsize-opt {
        flex: 1;
        padding: 0.4rem 0.25rem;
        border-radius: calc(var(--radius-sm) - 2px);
        border: none;
        background: transparent;
        color: var(--text-secondary);
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.12s, color 0.12s;
        text-align: center;
        min-width: 0;
    }

    .fontsize-opt:hover { background: var(--surface-3); color: var(--text); }

    .fontsize-opt-active {
        background: var(--surface);
        color: var(--primary);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }

    .fontsize-opt:active { transform: scale(0.94); }

    .participants-bar {
        display: flex;
        gap: 0.2rem;
    }

    .participant-avatar {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background: var(--uc-bg, var(--surface-2));
        border: 1.5px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        font-weight: 800;
        color: var(--uc-text, var(--muted));
        cursor: default;
        transition: transform 0.15s;
    }

    .participant-avatar:hover { transform: scale(1.1); }

    .avatar-me {
        outline: 2px solid var(--primary);
        outline-offset: 1px;
    }

    .code-chip {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        background: var(--primary-dim);
        border: 1.5px solid var(--border);
        border-radius: 0.5rem;
        padding: 0.25rem 0.625rem;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
        flex-shrink: 0;
    }

    .code-chip:hover { background: var(--primary-hover); border-color: var(--primary); }

    .code-text {
        font-size: 0.8125rem;
        font-weight: 800;
        letter-spacing: 0.1em;
        color: var(--primary);
    }

    .btn-header {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        background: transparent;
        border: 1.5px solid var(--border);
        border-radius: var(--radius-sm);
        padding: 0.3rem 0.75rem;
        cursor: pointer;
        text-decoration: none;
        transition: border-color 0.15s, color 0.15s;
        white-space: nowrap;
    }

    .btn-header:hover {
        border-color: var(--muted);
        color: var(--text);
        text-decoration: none;
    }

    .btn-header-done {
        background: var(--green-dim);
        color: var(--green);
        border-color: rgba(52,211,153,0.3);
        display: flex;
        align-items: center;
        gap: 0.35rem;
    }
    .btn-header-done:hover { background: rgba(52,211,153,0.2); border-color: var(--green); }

    @media (prefers-reduced-motion: reduce) {
        .participant-avatar { transition: none; }
    }

    @media print {
        .header { display: none; }
    }
</style>
