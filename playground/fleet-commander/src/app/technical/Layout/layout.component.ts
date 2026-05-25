import { Component, inject, computed } from '@angular/core'
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'
import { filter, map } from 'rxjs/operators'
import { toSignal } from '@angular/core/rxjs-interop'
import { SidebarComponent } from './sidebar.component'
import { TopbarComponent } from './topbar.component'
import { I18nService } from '../I18n/i18n.service'
import { SettingsService } from '../Settings/settings.service'

const ROUTE_TITLES: Record<string, Record<string, string>> = {
    '/':          { fr: 'Tableau de bord', en: 'Dashboard',     it: 'Dashboard'      },
    '/inventory': { fr: 'Inventaire',      en: 'Inventory',     it: 'Inventario'     },
    '/profiles':  { fr: 'Configurateur',   en: 'Configurator',  it: 'Configuratore'  },
    '/repairs':   { fr: 'Réparations',     en: 'Repairs',       it: 'Riparazioni'    },
    '/orders':    { fr: 'Commandes',       en: 'Orders',        it: 'Ordini'         },
    '/alerts':    { fr: 'Alertes',         en: 'Alerts',        it: 'Avvisi'         },
    '/settings':  { fr: 'Réglages',        en: 'Settings',      it: 'Impostazioni'   },
}

@Component({
    selector: 'fc-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, TopbarComponent],
    styles: [`
        .fc-layout {
            display: flex;
            height: 100vh;
            overflow: hidden;
        }

        .fc-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
            overflow: hidden;
        }

        .fc-content {
            flex: 1;
            overflow-y: auto;
        }
    `],
    template: `
        <div class="fc-layout">
            <fc-sidebar />
            <div class="fc-main">
                <fc-topbar [title]="pageTitle()" />
                <div class="fc-content">
                    <router-outlet />
                </div>
            </div>
        </div>
    `,
})
export class LayoutComponent {
    private readonly router = inject(Router)
    private readonly i18n = inject(I18nService)
    readonly _settings = inject(SettingsService)

    private readonly currentUrl = toSignal(
        this.router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            map(e => e.urlAfterRedirects),
        ),
        { initialValue: this.router.url },
    )

    readonly pageTitle = computed(() => {
        const url = this.currentUrl()
        const lang = this.i18n.lang()
        const base = url.split('?')[0].split('#')[0]
        return ROUTE_TITLES[base]?.[lang] ?? 'Fleet Commander'
    })
}
