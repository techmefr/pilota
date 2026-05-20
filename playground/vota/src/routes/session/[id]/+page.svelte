<script lang="ts">
    import { useSession } from '$lib/functional/useSession.svelte.ts'
    import { t, lang, langLabels, type Lang } from '$lib/technical/i18n'
    import { theme, fontSize } from '$lib/technical/theme'
    import { AVAILABLE_TAGS } from '$lib/technical/types'
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()

    const s = useSession(data)
    const langs = Object.entries(langLabels) as [Lang, string][]

    const FONT_SIZE_OPTIONS = [
        { label: 'A−', value: 15 },
        { label: 'A',  value: 17 },
        { label: 'A+', value: 19 },
        { label: 'A++', value: 21 },
    ]
</script>

<!-- Overlay: join prompt -->
{#if s.showNamePrompt}
    <div class="overlay">
        <div class="modal">
            <p class="modal-label">{$t('join.session')}</p>
            <h2 class="modal-title">{s.session.name}</h2>
            <label for="join-name" class="sr-only">{$t('home.your_name')}</label>
            <input id="join-name" class="input" type="text" placeholder="Alice" bind:value={s.nameInput} onkeydown={(e) => e.key === 'Enter' && s.joinSession()} />
            <button class="btn-primary" onclick={s.joinSession} disabled={!s.nameInput.trim()}>{$t('join.join')}</button>
        </div>
    </div>
{/if}

<!-- Overlay: session complete -->
{#if s.showSessionEnd}
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
{/if}

<!-- Overlay: export -->
{#if s.showExport}
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
{/if}

<!-- Overlay: add task -->
{#if s.showAddTask}
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
{/if}

<div class="app">
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
                                    class:lang-opt-active={$lang === code}
                                    onclick={() => lang.set(code)}
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
    </header>

    <div class="progress-bar">
        <div class="progress-fill" style:width="{s.tasks.length > 0 ? (s.estimatedCount / s.tasks.length) * 100 : 0}%"></div>
    </div>

    <div class="main">
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

        <section class="voting-zone">
            {#if !s.currentTask}
                <div class="no-task-state">
                    <div class="no-task-cards">
                        <div class="demo-card demo-card-back">🂠</div>
                        <div class="demo-card demo-card-back">🂠</div>
                        <div class="demo-card demo-card-back">🂠</div>
                    </div>
                    <p class="no-task-label">{$t('session.no_task')}</p>
                    <span class="ws-badge">{$t('session.via_graphql')}</span>
                </div>
            {:else}
                <div class="vote-panel">
                    <div class="task-detail">
                        <div class="task-detail-info">
                            <h2 class="task-detail-title">{s.currentTask.title}</h2>
                            {#if s.currentTask.description}<p class="task-detail-desc">{s.currentTask.description}</p>{/if}
                            <div class="task-detail-meta">
                                {#if s.currentTask.link}
                                    <a class="task-ticket-link" href={s.currentTask.link} target="_blank" rel="noopener">{$t('task.see_ticket')}</a>
                                {/if}
                                {#if s.currentTask.tags?.length}
                                    <div class="task-card-tags">
                                        {#each s.currentTask.tags as tag}<span class="tag">{tag}</span>{/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                        {#if s.currentTask.image}
                            <img class="task-thumbnail" src={s.currentTask.image} alt={s.currentTask.title} />
                        {/if}
                    </div>

                    {#if !s.allRevealed}
                        <div class="vote-section">
                            <p class="section-label">{$t('session.your_vote')}</p>
                            <div class="cards-row">
                                {#each s.cards as card}
                                    <button
                                        class="poker-card"
                                        class:poker-card-selected={s.myVote?.value === card}
                                        class:poker-card-special={card === '?' || card === '∞'}
                                        onclick={() => s.vote(card)}
                                    >
                                        <span class="card-corner card-corner-tl">{card}</span>
                                        <span class="card-center">{card}</span>
                                        <span class="card-corner card-corner-br">{card}</span>
                                    </button>
                                {/each}
                            </div>

                            <div class="voters-row">
                                {#each s.participants as p}
                                    {@const hasVoted = s.currentVotes.some(v => v.participant === p.name && v.value !== null)}
                                    <div class="voter-chip uc-{s.getUserColorIndex(p.name)}" class:voter-done={hasVoted}>
                                        <span class="voter-indicator"></span>
                                        <span class="voter-name-text">{p.name}</span>
                                        {#if hasVoted}<span class="voter-check">{$t('vote.voted')}</span>{/if}
                                    </div>
                                {/each}
                            </div>

                            {#if s.isCreator && s.currentVotes.some(v => v.value)}
                                <button class="btn-reveal" onclick={s.revealVotes}>{$t('session.reveal')}</button>
                            {/if}
                        </div>
                    {:else}
                        <div class="reveal-section">
                            <div class="revealed-cards">
                                {#each s.currentVotes as v}
                                    <div class="revealed-vote uc-{s.getUserColorIndex(v.participant)}">
                                        <div class="poker-card poker-card-revealed" class:poker-card-special={v.value === '?' || v.value === '∞'}>
                                            <span class="card-corner card-corner-tl">{v.value ?? '?'}</span>
                                            <span class="card-center">{v.value ?? '?'}</span>
                                            <span class="card-corner card-corner-br">{v.value ?? '?'}</span>
                                        </div>
                                        <span class="revealed-name">{v.participant}</span>
                                    </div>
                                {/each}
                            </div>

                            <div class="average-row">
                                <span class="average-label">{$t('session.average')} :</span>
                                <strong class="average-value">{s.getVoteAverage()}</strong>
                                <span class="consensus-badge consensus-{s.consensusLevel()}">
                                    {#if s.consensusLevel() === 'unanimous'}
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                        Unanime
                                    {:else if s.consensusLevel() === 'near'}
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                        Proche
                                    {:else}
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                        Débat
                                    {/if}
                                </span>
                            </div>

                            {#if s.voteDistribution().length > 1}
                                <div class="vote-distribution">
                                    {#each s.voteDistribution() as d}
                                        <div class="dist-row">
                                            <span class="dist-label">{d.value}</span>
                                            <div class="dist-bar-wrap">
                                                <div class="dist-bar" style="width:{d.pct}%"></div>
                                            </div>
                                            <span class="dist-count">{d.count}×</span>
                                        </div>
                                    {/each}
                                </div>
                            {/if}

                            {#if s.suggestedEstimate()}
                                <div class="suggestion-row">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <span class="suggestion-label">Suggestion</span>
                                    <strong class="suggestion-value">{s.suggestedEstimate()}</strong>
                                    {#if s.finalEstimate !== s.suggestedEstimate()}
                                        <button class="suggestion-apply" onclick={() => { s.finalEstimate = s.suggestedEstimate() }}>
                                            Appliquer
                                        </button>
                                    {/if}
                                </div>
                            {/if}

                            <div class="estimate-row">
                                <label for="final-estimate" class="sr-only">{$t('session.final_estimate')}</label>
                                <input
                                    id="final-estimate"
                                    class="input input-estimate"
                                    type="text"
                                    placeholder={$t('session.final_estimate')}
                                    bind:value={s.finalEstimate}
                                    onkeydown={(e) => e.key === 'Enter' && s.setEstimate()}
                                />
                                <button class="btn-primary" onclick={s.setEstimate} disabled={!s.finalEstimate.trim()}>
                                    {$t('session.validate')}
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </section>
    </div>
</div>

<style>
    /* ── Animations ──────────────────────────────── */
    @keyframes modalIn {
        from { opacity: 0; transform: scale(0.96) translateY(10px); }
        to   { opacity: 1; transform: scale(1)    translateY(0); }
    }

    @keyframes cardFlip {
        from { opacity: 0; transform: rotateY(90deg) scale(0.85); }
        to   { opacity: 1; transform: rotateY(0deg)  scale(1); }
    }

    @keyframes taskSlide {
        from { opacity: 0; transform: translateX(-8px); }
        to   { opacity: 1; transform: translateX(0); }
    }

    @keyframes chipPop {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.08); }
        100% { transform: scale(1); }
    }

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Overlays ─────────────────────────────────── */
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

    .modal-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }

    /* ── App shell ────────────────────────────────── */
    .app {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
    }

    /* ── Header (unified topbar) ──────────────────── */
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

    /* ── Profile menu ─────────────────────────────── */
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

    /* ── Font size picker ────────────────────────── */
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

    /* ── Sidebar ──────────────────────────────────── */
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

    /* ── Voting zone ──────────────────────────────── */
    .voting-zone {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
        padding: 2rem;
        background: var(--bg);
    }

    .no-task-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        color: var(--muted);
        text-align: center;
    }

    .no-task-cards {
        display: flex;
        gap: 0.5rem;
        font-size: 4rem;
        opacity: 0.3;
    }

    .demo-card { line-height: 1; }

    .no-task-label {
        font-size: 1rem;
        font-weight: 500;
    }

    .ws-badge {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--primary);
        background: var(--primary-dim);
        border: 1px solid var(--border);
        border-radius: 99px;
        padding: 0.25rem 0.75rem;
        letter-spacing: 0.03em;
    }

    .vote-panel {
        width: 100%;
        max-width: 680px;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    /* ── Task detail ──────────────────────────────── */
    .task-detail {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
        background: var(--surface);
        border: 1.5px solid var(--border);
        border-radius: var(--radius);
        padding: 1.5rem;
    }

    .task-detail-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        min-width: 0;
    }

    .task-detail-title {
        font-size: 2rem;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.025em;
        animation: fadeUp 0.25s ease both;
    }

    .task-detail-desc {
        color: var(--text-secondary);
        font-size: 1rem;
        line-height: 1.6;
        animation: fadeUp 0.25s ease 0.05s both;
    }

    .task-detail-meta {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        flex-wrap: wrap;
    }

    .task-ticket-link {
        font-size: 0.9375rem;
        color: var(--primary);
        font-weight: 600;
    }

    .task-thumbnail {
        width: 110px;
        height: 75px;
        object-fit: cover;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        flex-shrink: 0;
    }

    /* ── Vote section ─────────────────────────────── */
    .vote-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .section-label {
        font-size: 0.6875rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--muted);
    }

    .cards-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    /* ── Poker cards ──────────────────────────────── */
    .poker-card {
        position: relative;
        width: 4.25rem;
        height: 5.75rem;
        background: var(--surface);
        border: 2px solid var(--border);
        border-radius: 0.75rem;
        cursor: pointer;
        transition: border-color 0.15s, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s, box-shadow 0.18s;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .poker-card:hover {
        border-color: var(--primary);
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 12px 28px var(--primary-dim);
    }

    .poker-card-selected {
        border-color: var(--primary);
        background: var(--primary-dim);
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 14px 32px var(--primary-hover);
    }

    .poker-card-revealed {
        cursor: default;
        border-color: transparent;
        background: var(--uc-bg, var(--primary-dim));
    }

    .poker-card-revealed .card-corner,
    .poker-card-revealed .card-center { color: var(--uc-text, var(--primary)); }

    .poker-card-revealed:hover { transform: none; }

    .poker-card-special {
        border-color: var(--muted);
        background: transparent;
        color: var(--muted);
    }

    .poker-card-special .card-corner,
    .poker-card-special .card-center { color: var(--muted); }

    .card-corner {
        position: absolute;
        font-size: 0.6rem;
        font-weight: 800;
        color: var(--primary);
        line-height: 1;
    }

    .card-corner-tl { top: 0.3rem; left: 0.35rem; }
    .card-corner-br { bottom: 0.3rem; right: 0.35rem; transform: rotate(180deg); }

    .card-center {
        font-size: 1.5rem;
        font-weight: 900;
        color: var(--primary);
        pointer-events: none;
    }

    /* ── Voters status ────────────────────────────── */
    .voters-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .voter-chip {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.875rem;
        padding: 0.3rem 0.75rem;
        border-radius: 99px;
        background: var(--surface-2);
        border: 1.5px solid var(--border);
        transition: border-color 0.2s, background 0.2s;
    }

    .voter-done {
        background: var(--uc-bg, var(--surface-2));
        border-color: transparent;
        animation: chipPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    .voter-indicator {
        width: 0.45rem;
        height: 0.45rem;
        border-radius: 50%;
        background: var(--border);
        transition: background 0.2s;
    }

    .voter-done .voter-indicator { background: var(--uc-text, var(--green)); }

    .voter-name-text { color: var(--text-secondary); }

    .voter-done .voter-name-text { color: var(--uc-text, var(--text)); font-weight: 600; }

    .voter-check {
        color: var(--uc-text, var(--green));
        font-size: 0.75rem;
        font-weight: 700;
    }

    .btn-reveal {
        align-self: flex-start;
        background: var(--primary);
        color: var(--on-primary);
        border: none;
        border-radius: var(--radius-sm);
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.15s, transform 0.1s;
    }

    .btn-reveal:hover { opacity: 0.9; transform: translateY(-1px); }

    /* ── Revealed votes ───────────────────────────── */
    .reveal-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .revealed-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
    }

    .revealed-vote {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        animation: cardFlip 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .revealed-vote:nth-child(1)  { animation-delay: 0ms; }
    .revealed-vote:nth-child(2)  { animation-delay: 60ms; }
    .revealed-vote:nth-child(3)  { animation-delay: 120ms; }
    .revealed-vote:nth-child(4)  { animation-delay: 180ms; }
    .revealed-vote:nth-child(5)  { animation-delay: 240ms; }
    .revealed-vote:nth-child(6)  { animation-delay: 300ms; }
    .revealed-vote:nth-child(7)  { animation-delay: 360ms; }
    .revealed-vote:nth-child(8)  { animation-delay: 400ms; }
    .revealed-vote:nth-child(n+9) { animation-delay: 440ms; }

    .revealed-name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--uc-text, var(--muted));
    }

    .average-row {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        font-size: 0.875rem;
    }

    .average-label { color: var(--muted); font-size: 1rem; }
    .average-value { font-size: 3rem; font-weight: 800; color: var(--primary); animation: fadeUp 0.3s ease both; }

    .estimate-row {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .input-estimate {
        flex: 1;
        min-width: 0;
    }

    /* ── Shared form elements ─────────────────────── */
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

    /* ── Active states ────────────────────────────── */
    .btn-primary:active:not(:disabled) { transform: scale(0.97); }
    .btn-outline:active:not(:disabled) { transform: scale(0.97); }
    .btn-reveal:active:not(:disabled) { transform: scale(0.97); }
    .export-btn:active { transform: scale(0.95); }
    .poker-card:active:not(:disabled) { transform: scale(0.95) !important; }
    .task-card:active { transform: scale(0.99) !important; }
    .lang-opt:active { transform: scale(0.94); }
    .fontsize-opt:active { transform: scale(0.94); }
    .theme-opt:active { transform: scale(0.96); }

    /* ── Reduced motion ───────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
        .modal-backdrop, .modal { animation: none; }
        .task-card { animation: none; }
        .poker-card { transition: border-color 0.1s, background 0.1s; }
        .voter-done { animation: none; }
        .poker-card-revealed { animation: none; }
        .btn-primary, .btn-outline, .btn-reveal, .export-btn { transition: opacity 0.1s, background 0.1s; }
        .participant-avatar { transition: none; }
    }

    /* ── Consensus badge ─────────────────────────── */
    .consensus-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.8125rem;
        font-weight: 700;
        padding: 0.2rem 0.6rem;
        border-radius: 99px;
        margin-left: 0.5rem;
    }
    .consensus-unanimous { background: var(--green-dim); color: var(--green); border: 1px solid var(--green-dim); }
    .consensus-near      { background: var(--primary-dim); color: var(--primary); border: 1px solid var(--primary-dim); }
    .consensus-split     { background: var(--red-dim); color: var(--red); border: 1px solid var(--red-dim); }

    /* ── Vote distribution ───────────────────────── */
    .vote-distribution {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 0.75rem 1rem;
        background: var(--surface-2);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
    }
    .dist-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
    }
    .dist-label { width: 2rem; text-align: right; color: var(--text-secondary); font-weight: 700; font-variant-numeric: tabular-nums; }
    .dist-bar-wrap { flex: 1; height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
    .dist-bar { height: 100%; background: var(--primary); border-radius: 99px; transition: width 0.4s cubic-bezier(0.16,1,0.3,1); }
    .dist-count { width: 2rem; color: var(--muted); font-size: 0.8125rem; }

    /* ── Suggestion ──────────────────────────────── */
    .suggestion-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 0.875rem;
        background: var(--primary-dim);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        font-size: 0.9375rem;
        color: var(--primary);
    }
    .suggestion-label { color: var(--text-secondary); }
    .suggestion-value { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; color: var(--primary); margin: 0 0.25rem; }
    .suggestion-apply {
        margin-left: auto;
        font-size: 0.8125rem;
        font-weight: 600;
        padding: 0.2rem 0.6rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        background: transparent;
        color: var(--primary);
        cursor: pointer;
        transition: background 0.12s;
    }
    .suggestion-apply:hover { background: var(--primary-hover); }

    /* ── Header done button ──────────────────────── */
    .btn-header-done {
        background: var(--green-dim);
        color: var(--green);
        border-color: rgba(52,211,153,0.3);
        display: flex;
        align-items: center;
        gap: 0.35rem;
    }
    .btn-header-done:hover { background: rgba(52,211,153,0.2); border-color: var(--green); }

    /* ── Session end modal ───────────────────────── */
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

    /* ── Print ────────────────────────────────────── */
    @media print {
        .header, .sidebar, .cards-row, .vote-section, .btn-reveal, .estimate-row, .overlay { display: none; }
        .voting-zone { padding: 0; overflow: visible; }
    }
</style>
