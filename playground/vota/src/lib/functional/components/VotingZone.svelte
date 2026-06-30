<script lang="ts">
    import { getTranslate } from '@tolgee/svelte'
    import type { useSession } from '$lib/functional/useSession.svelte.ts'

    let { s }: { s: ReturnType<typeof useSession> } = $props()

    const { t } = getTranslate()
</script>

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

<style>
    @keyframes cardFlip {
        from { opacity: 0; transform: rotateY(90deg) scale(0.85); }
        to   { opacity: 1; transform: rotateY(0deg)  scale(1); }
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

    .task-thumbnail {
        width: 110px;
        height: 75px;
        object-fit: cover;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        flex-shrink: 0;
    }

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

    .btn-reveal:active:not(:disabled) { transform: scale(0.97); }
    .poker-card:active:not(:disabled) { transform: scale(0.95) !important; }

    @media (prefers-reduced-motion: reduce) {
        .poker-card { transition: border-color 0.1s, background 0.1s; }
        .voter-done { animation: none; }
        .poker-card-revealed { animation: none; }
        .btn-primary, .btn-reveal { transition: opacity 0.1s, background 0.1s; }
    }

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

    @media print {
        .cards-row, .vote-section, .btn-reveal, .estimate-row { display: none; }
        .voting-zone { padding: 0; overflow: visible; }
    }
</style>
