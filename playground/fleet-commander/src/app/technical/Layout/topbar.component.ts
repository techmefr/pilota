import { Component, inject, input } from '@angular/core'
import { I18nService } from '../I18n/i18n.service'

@Component({
    selector: 'fc-topbar',
    standalone: true,
    styles: [`
        .topbar {
            height: var(--topbar-h);
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            padding: 0 1.5rem;
            gap: 1rem;
            flex-shrink: 0;
        }

        .topbar-title {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text);
            letter-spacing: -0.01em;
        }

        .topbar-gap { flex: 1; }

        .hub-link {
            font-size: 0.72rem;
            color: var(--text-3);
            transition: color 0.12s;
            padding: 0.35rem 0.7rem;
            border: 1px solid var(--border);
            border-radius: 6px;
            background: var(--card);
        }

        .hub-link:hover {
            color: var(--text);
            border-color: var(--border-hi);
        }

        .branch-badge {
            font-family: ui-monospace, 'Cascadia Code', monospace;
            font-size: 0.6rem;
            font-weight: 600;
            color: var(--accent);
            background: var(--accent-bg);
            border: 1px solid var(--accent-brd);
            padding: 0.2rem 0.55rem;
            border-radius: 999px;
        }
    `],
    template: `
        <header class="topbar">
            <span class="topbar-title">{{ title() }}</span>
            <span class="topbar-gap"></span>
            <span class="branch-badge">fleet-commander</span>
            <a class="hub-link" [href]="hubUrl">← Hub</a>
        </header>
    `,
})
export class TopbarComponent {
    readonly title = input<string>('Fleet Commander')
    readonly i18n = inject(I18nService)

    readonly hubUrl = `http://${window.location.hostname.replace(/-fleet\.localhost$/, '')}-hub.localhost`
}
