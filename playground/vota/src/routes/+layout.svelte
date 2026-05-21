<script lang="ts">
    import { onMount } from 'svelte'
    import { TolgeeProvider } from '@tolgee/svelte'
    import { theme, fontSize } from '$lib/technical/theme'
    import { tolgee, LANG_LABELS, type Lang } from '$lib/technical/i18n'
    import { layoutBarVisible } from '$lib/technical/layout'

    let { children } = $props()

    let mounted = $state(false)
    let profileOpen = $state(false)
    let profileRef = $state<HTMLDivElement | null>(null)
    let currentLang = $state<Lang>('fr')

    onMount(() => {
        mounted = true
        document.documentElement.setAttribute('data-theme', $theme)
        currentLang = (tolgee.getLanguage() ?? 'fr') as Lang

        function handleClick(e: MouseEvent) {
            if (profileRef && !profileRef.contains(e.target as Node)) {
                profileOpen = false
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    })

    function setLang(l: Lang) {
        tolgee.changeLanguage(l)
        currentLang = l
    }

    const langs = Object.entries(LANG_LABELS) as [Lang, string][]

    const FONT_SIZE_OPTIONS = [
        { label: 'A−', value: 15 },
        { label: 'A',  value: 17 },
        { label: 'A+', value: 19 },
        { label: 'A++', value: 21 },
    ]
</script>

<svelte:head>
    <title>Vota — Planning Poker</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" />
</svelte:head>

<TolgeeProvider tolgee={tolgee}>
{#if $layoutBarVisible}
<nav class="topbar" class:mounted>
    <a class="brand" href="/">Vota</a>

    <div class="topbar-right">
        <div class="profile-wrap" bind:this={profileRef}>
            <button
                class="profile-btn"
                class:profile-open={profileOpen}
                onclick={() => (profileOpen = !profileOpen)}
                aria-label="Paramètres"
                aria-expanded={profileOpen}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
            </button>

            {#if profileOpen}
                <div class="profile-menu" role="menu">
                    <p class="profile-menu-label">Apparence</p>
                    <div class="theme-options">
                        <button
                            class="theme-opt"
                            class:theme-opt-active={$theme === 'light'}
                            onclick={() => { theme.set('light'); profileOpen = false }}
                            role="menuitem"
                        >
                            <span class="theme-swatch theme-swatch-light"></span>
                            Clair
                        </button>
                        <button
                            class="theme-opt"
                            class:theme-opt-active={$theme === 'dark'}
                            onclick={() => { theme.set('dark'); profileOpen = false }}
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
                        {#each FONT_SIZE_OPTIONS as opt}
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
</nav>
{/if}

{@render children()}
</TolgeeProvider>

<style>
    :global(*, *::before, *::after) {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    :global(html) {
        font-size: 17px;
    }

    :global(:root) {
        --navbar-height: 3rem;

        /* Dark — Google Material Dark */
        --bg: #202124;
        --surface: #292A2D;
        --surface-2: #35363A;
        --surface-3: #3C3D41;
        --border: #3D3F42;
        --border-strong: #5F6368;

        --primary: #8AB4F8;
        --primary-dim: rgba(138, 180, 248, 0.12);
        --primary-hover: rgba(138, 180, 248, 0.2);
        --on-primary: #202124;

        --text: #E8EAED;
        --text-secondary: #9AA0A6;
        --muted: #8F9397;

        --green: #81C995;
        --green-dim: rgba(129, 201, 149, 0.12);
        --red: #F28B82;
        --red-dim: rgba(242, 139, 130, 0.12);

        --shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
        --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.4);

        --radius: 0.75rem;
        --radius-sm: 0.5rem;
        --radius-lg: 1.25rem;
        --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
        color-scheme: dark;
    }

    :global([data-theme="light"]) {
        /* Light — Google Material Light */
        --bg: #F8F9FA;
        --surface: #FFFFFF;
        --surface-2: #F1F3F4;
        --surface-3: #E8EAED;
        --border: #DADCE0;
        --border-strong: #BDC1C6;

        --primary: #1558B0;
        --primary-dim: rgba(21, 88, 176, 0.1);
        --primary-hover: rgba(21, 88, 176, 0.18);
        --on-primary: #FFFFFF;

        --text: #202124;
        --text-secondary: #5F6368;
        --muted: #636B70;

        --green: #188038;
        --green-dim: rgba(24, 128, 56, 0.1);
        --red: #C5221F;
        --red-dim: rgba(197, 34, 31, 0.1);

        --shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        --shadow-sm: 0 1px 5px rgba(0, 0, 0, 0.07);
        color-scheme: light;
    }

    /* ── User colors (10 slots, déterministes par hash du nom) ── */
    :global(.uc-0) { --uc-bg: hsl(350,50%,22%); --uc-text: hsl(350,85%,78%); }
    :global(.uc-1) { --uc-bg: hsl(22,55%,22%);  --uc-text: hsl(22,85%,75%); }
    :global(.uc-2) { --uc-bg: hsl(42,60%,20%);  --uc-text: hsl(42,85%,72%); }
    :global(.uc-3) { --uc-bg: hsl(138,45%,18%); --uc-text: hsl(138,65%,68%); }
    :global(.uc-4) { --uc-bg: hsl(172,50%,18%); --uc-text: hsl(172,70%,65%); }
    :global(.uc-5) { --uc-bg: hsl(210,55%,20%); --uc-text: hsl(210,80%,75%); }
    :global(.uc-6) { --uc-bg: hsl(245,50%,22%); --uc-text: hsl(245,75%,78%); }
    :global(.uc-7) { --uc-bg: hsl(278,48%,22%); --uc-text: hsl(278,75%,78%); }
    :global(.uc-8) { --uc-bg: hsl(320,48%,22%); --uc-text: hsl(320,75%,78%); }
    :global(.uc-9) { --uc-bg: hsl(195,50%,20%); --uc-text: hsl(195,75%,72%); }

    :global([data-theme="light"] .uc-0) { --uc-bg: hsl(350,85%,93%); --uc-text: hsl(350,65%,35%); }
    :global([data-theme="light"] .uc-1) { --uc-bg: hsl(22,85%,92%);  --uc-text: hsl(22,65%,35%); }
    :global([data-theme="light"] .uc-2) { --uc-bg: hsl(42,85%,90%);  --uc-text: hsl(42,65%,32%); }
    :global([data-theme="light"] .uc-3) { --uc-bg: hsl(138,60%,91%); --uc-text: hsl(138,55%,28%); }
    :global([data-theme="light"] .uc-4) { --uc-bg: hsl(172,60%,90%); --uc-text: hsl(172,55%,26%); }
    :global([data-theme="light"] .uc-5) { --uc-bg: hsl(210,70%,91%); --uc-text: hsl(210,60%,32%); }
    :global([data-theme="light"] .uc-6) { --uc-bg: hsl(245,70%,92%); --uc-text: hsl(245,60%,38%); }
    :global([data-theme="light"] .uc-7) { --uc-bg: hsl(278,65%,92%); --uc-text: hsl(278,60%,36%); }
    :global([data-theme="light"] .uc-8) { --uc-bg: hsl(320,65%,92%); --uc-text: hsl(320,60%,36%); }
    :global([data-theme="light"] .uc-9) { --uc-bg: hsl(195,65%,90%); --uc-text: hsl(195,60%,30%); }

    :global(body) {
        background: var(--bg);
        color: var(--text);
        font-family: var(--font);
        font-size: 1rem;
        line-height: 1.5;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        transition: background 0.2s, color 0.2s;
    }

    :global(a) {
        color: var(--primary);
        text-decoration: none;
    }

    :global(a:hover) { text-decoration: underline; }

    :global(input, button, select, textarea) { font-family: var(--font); }

    :global(:focus-visible) {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    /* ── Topbar ───────────────────────────────────── */
    .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: var(--navbar-height);
        padding: 0 1.5rem;
        background: var(--surface);
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 200;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.15s;
    }

    .topbar.mounted {
        opacity: 1;
        pointer-events: all;
    }

    .brand {
        font-size: 1.1rem;
        font-weight: 900;
        letter-spacing: -0.04em;
        color: var(--text);
        text-decoration: none;
    }

    .brand:hover { text-decoration: none; color: var(--primary); }

    .topbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    /* ── Profile menu extras ──────────────────────── */
    .menu-divider {
        height: 1px;
        background: var(--border);
        margin: 0.125rem 0;
    }

    /* ── Language picker ─────────────────────────── */
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

    /* ── Theme swatches ──────────────────────────── */
    .theme-swatch {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .theme-swatch-light { background: #F8F9FA; border: 1.5px solid #DADCE0; }
    .theme-swatch-dark  { background: #202124; border: 1.5px solid #5F6368; }

    /* ── Profile avatar ───────────────────────────── */
    .profile-wrap {
        position: relative;
    }

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

    /* ── Profile dropdown ─────────────────────────── */
    .profile-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 0.75rem;
        min-width: 210px;
        box-shadow: var(--shadow);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
        color: var(--text-secondary);
        padding: 0.25rem 0.25rem 0;
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
        padding: 0.45rem 0.625rem;
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

    .profile-btn:active { transform: scale(0.93); }
    .theme-opt:active { transform: scale(0.96); }
    .fontsize-opt:active { transform: scale(0.94); }
    .lang-opt:active { transform: scale(0.94); }

    @media (prefers-reduced-motion: reduce) {
        .topbar { transition: none; }
        :global(body) { transition: none; }
        .profile-menu { animation: none; }
        .profile-btn, .theme-opt, .lang-opt { transition: none; }
    }
</style>
