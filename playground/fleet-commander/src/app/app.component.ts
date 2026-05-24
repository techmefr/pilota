import { Component, inject, effect } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { I18nService } from './technical/I18n/i18n.service'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `<router-outlet />`,
})
export class AppComponent {
    private readonly i18n = inject(I18nService)

    constructor() {
        effect(() => {
            document.documentElement.setAttribute('lang', this.i18n.lang())
        })
    }
}
