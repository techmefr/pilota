import { Component, inject } from '@angular/core'
import { I18nService } from '../../technical/I18n/i18n.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import { SettingsService } from '../../technical/Settings/settings.service'
import type { Theme, FontSize } from '../../technical/Settings/settings.service'
import type { Lang } from '../../technical/I18n/i18n.service'

@Component({
    selector: 'fc-settings',
    standalone: true,
    imports: [TranslatePipe],
    styles: [`
        .page { padding: 2rem; overflow-y: auto; height: 100%; }
        .page-header { margin-bottom: 2rem; }
        .page-title { font-size: 1.35rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.25rem; }
        .page-sub { font-size: 0.8rem; color: var(--text-2); }

        .settings-stack { display: flex; flex-direction: column; gap: 1.25rem; max-width: 560px; }

        .settings-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
        }

        .card-header {
            padding: 0.9rem 1.25rem;
            border-bottom: 1px solid var(--border);
            font-size: 0.6rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--text-3);
        }

        .card-body { padding: 0.5rem 0; }

        .setting-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.9rem 1.25rem;
            gap: 1rem;
        }

        .setting-row + .setting-row {
            border-top: 1px solid var(--border);
        }

        .setting-label {
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--text);
        }

        .btn-group {
            display: flex;
            gap: 0.35rem;
        }

        .opt-btn {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 7px;
            color: var(--text-2);
            font-size: 0.78rem;
            font-weight: 500;
            padding: 0.4rem 0.85rem;
            cursor: pointer;
            transition: background 0.12s, color 0.12s, border-color 0.12s;
            white-space: nowrap;
        }

        .opt-btn:hover {
            background: var(--card-hi);
            color: var(--text);
            border-color: var(--border-hi);
        }

        .opt-btn.active {
            background: var(--accent-bg);
            border-color: var(--accent-brd);
            color: var(--accent);
            font-weight: 600;
        }

        .lang-btn {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.4rem 1rem;
        }

        .lang-flag {
            font-size: 1rem;
            line-height: 1;
        }
    `],
    template: `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">{{ 'settings_title' | translate }}</h1>
                <p class="page-sub">{{ 'settings_sub' | translate }}</p>
            </div>

            <div class="settings-stack">

                <div class="settings-card">
                    <div class="card-header">{{ 'settings_appearance' | translate }}</div>
                    <div class="card-body">

                        <div class="setting-row">
                            <span class="setting-label">{{ 'settings_theme' | translate }}</span>
                            <div class="btn-group">
                                <button
                                    class="opt-btn"
                                    [class.active]="settings.theme() === 'dark'"
                                    (click)="setTheme('dark')"
                                >{{ 'settings_theme_dark' | translate }}</button>
                                <button
                                    class="opt-btn"
                                    [class.active]="settings.theme() === 'light'"
                                    (click)="setTheme('light')"
                                >{{ 'settings_theme_light' | translate }}</button>
                            </div>
                        </div>

                        <div class="setting-row">
                            <span class="setting-label">{{ 'settings_font_size' | translate }}</span>
                            <div class="btn-group">
                                <button
                                    class="opt-btn"
                                    [class.active]="settings.fontSize() === 'sm'"
                                    (click)="setFontSize('sm')"
                                >{{ 'settings_font_sm' | translate }}</button>
                                <button
                                    class="opt-btn"
                                    [class.active]="settings.fontSize() === 'md'"
                                    (click)="setFontSize('md')"
                                >{{ 'settings_font_md' | translate }}</button>
                                <button
                                    class="opt-btn"
                                    [class.active]="settings.fontSize() === 'lg'"
                                    (click)="setFontSize('lg')"
                                >{{ 'settings_font_lg' | translate }}</button>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="settings-card">
                    <div class="card-header">{{ 'settings_language' | translate }}</div>
                    <div class="card-body">
                        <div class="setting-row">
                            <span class="setting-label">{{ 'settings_language' | translate }}</span>
                            <div class="btn-group">
                                <button
                                    class="opt-btn lang-btn"
                                    [class.active]="i18n.lang() === 'fr'"
                                    (click)="setLang('fr')"
                                ><span class="lang-flag">🇫🇷</span> Français</button>
                                <button
                                    class="opt-btn lang-btn"
                                    [class.active]="i18n.lang() === 'en'"
                                    (click)="setLang('en')"
                                ><span class="lang-flag">🇬🇧</span> English</button>
                                <button
                                    class="opt-btn lang-btn"
                                    [class.active]="i18n.lang() === 'it'"
                                    (click)="setLang('it')"
                                ><span class="lang-flag">🇮🇹</span> Italiano</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,
})
export class SettingsComponent {
    readonly i18n = inject(I18nService)
    readonly settings = inject(SettingsService)

    setTheme(theme: Theme): void {
        this.settings.setTheme(theme)
    }

    setFontSize(size: FontSize): void {
        this.settings.setFontSize(size)
    }

    setLang(lang: Lang): void {
        this.i18n.setLang(lang)
    }
}
