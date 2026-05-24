import { Component, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { I18nService } from '../I18n/i18n.service'
import { TranslatePipe } from '../I18n/translate.pipe'

interface NavItem {
    path: string
    labelKey: 'nav_fleet' | 'nav_inventory' | 'nav_profiles' | 'nav_repairs' | 'nav_orders' | 'nav_alerts'
    icon: string
}

@Component({
    selector: 'fc-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, TranslatePipe],
    styles: [`
        .sidebar {
            width: var(--sidebar-w);
            height: 100%;
            background: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }

        .sidebar-logo {
            padding: 1.25rem 1rem 1rem;
            border-bottom: 1px solid var(--border);
        }

        .logo-title {
            font-size: 0.7rem;
            font-weight: 900;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--accent);
        }

        .logo-sub {
            font-size: 0.58rem;
            color: var(--text-3);
            letter-spacing: 0.04em;
            margin-top: 0.15rem;
        }

        .nav {
            flex: 1;
            padding: 0.75rem 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.1rem;
            overflow-y: auto;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 0.65rem;
            padding: 0.55rem 0.75rem;
            border-radius: 7px;
            font-size: 0.82rem;
            font-weight: 500;
            color: var(--text-2);
            transition: background 0.12s, color 0.12s;
            cursor: pointer;
        }

        .nav-link:hover {
            background: var(--card);
            color: var(--text);
        }

        .nav-link.active {
            background: var(--accent-bg);
            color: var(--accent);
            font-weight: 600;
        }

        .nav-icon {
            width: 16px;
            height: 16px;
            opacity: 0.7;
            flex-shrink: 0;
        }

        .nav-link.active .nav-icon {
            opacity: 1;
        }

        .sidebar-footer {
            padding: 0.75rem 0.5rem 1rem;
            border-top: 1px solid var(--border);
        }

        .lang-toggle {
            display: flex;
            gap: 0.35rem;
            padding: 0.35rem 0.75rem;
        }

        .lang-btn {
            background: transparent;
            border: 1px solid var(--border);
            border-radius: 5px;
            color: var(--text-3);
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.25rem 0.6rem;
            cursor: pointer;
            transition: background 0.12s, color 0.12s, border-color 0.12s;
        }

        .lang-btn:hover {
            background: var(--card);
            color: var(--text);
        }

        .lang-btn.active {
            background: var(--accent-bg);
            border-color: var(--accent-brd);
            color: var(--accent);
        }
    `],
    template: `
        <aside class="sidebar">
            <div class="sidebar-logo">
                <div class="logo-title">Fleet Commander</div>
                <div class="logo-sub">HP Fleet Hypervision</div>
            </div>

            <nav class="nav">
                @for (item of navItems; track item.path) {
                    <a
                        class="nav-link"
                        [routerLink]="item.path"
                        routerLinkActive="active"
                        [routerLinkActiveOptions]="{ exact: item.path === '/' }"
                    >
                        <svg class="nav-icon" viewBox="0 0 16 16" fill="currentColor" [innerHTML]="item.icon"></svg>
                        {{ item.labelKey | translate }}
                    </a>
                }
            </nav>

            <div class="sidebar-footer">
                <div class="lang-toggle">
                    <button
                        class="lang-btn"
                        [class.active]="i18n.lang() === 'fr'"
                        (click)="i18n.setLang('fr')"
                    >FR</button>
                    <button
                        class="lang-btn"
                        [class.active]="i18n.lang() === 'en'"
                        (click)="i18n.setLang('en')"
                    >EN</button>
                </div>
            </div>
        </aside>
    `,
})
export class SidebarComponent {
    readonly i18n = inject(I18nService)

    readonly navItems: NavItem[] = [
        {
            path: '/',
            labelKey: 'nav_fleet',
            icon: '<rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
        },
        {
            path: '/inventory',
            labelKey: 'nav_inventory',
            icon: '<path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>',
        },
        {
            path: '/profiles',
            labelKey: 'nav_profiles',
            icon: '<rect x="2" y="2" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M5 14h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        },
        {
            path: '/repairs',
            labelKey: 'nav_repairs',
            icon: '<path d="M10.5 2.5l3 3-7 7-3.5.5.5-3.5 7-7z" stroke="currentColor" stroke-width="1.5" fill="none"/>',
        },
        {
            path: '/orders',
            labelKey: 'nav_orders',
            icon: '<path d="M3 3h10l-1 7H4L3 3z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="6" cy="13.5" r="1" fill="currentColor"/><circle cx="11" cy="13.5" r="1" fill="currentColor"/>',
        },
        {
            path: '/alerts',
            labelKey: 'nav_alerts',
            icon: '<path d="M8 2l5.5 9.5H2.5L8 2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><path d="M8 7v3M8 11.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
        },
    ]
}
