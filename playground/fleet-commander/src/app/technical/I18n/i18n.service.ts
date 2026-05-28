import { Injectable, signal, computed } from '@angular/core'
import { Tolgee, BackendFetch, FormatSimple, LanguageStorage } from '@tolgee/web'
import type { TolgeeInstance } from '@tolgee/web'
import staticFr from './fr.json'
import staticEn from './en.json'
import staticIt from './it.json'

export type Lang = 'fr' | 'en' | 'it'
export type Translations = Record<string, string>

const STATIC: Record<Lang, Translations> = {
    fr: staticFr as Translations,
    en: staticEn as Translations,
    it: staticIt as Translations,
}

function getApiKey(): string {
    return (window as Window & { __fleet_env?: { tolgeeApiKey?: string } }).__fleet_env?.tolgeeApiKey ?? 'tgpak_gqzv62dggj2tkzddhfyxk5jyn5ywymttnnsta5jshfqxcoa'
}

function getApiUrl(): string {
    return (window as Window & { __fleet_env?: { tolgeeApiUrl?: string } }).__fleet_env?.tolgeeApiUrl ?? 'http://tolgee.localhost'
}

@Injectable({ providedIn: 'root' })
export class I18nService {
    readonly lang = signal<Lang>('fr')
    readonly t = computed(() => STATIC[this.lang()])

    private tolgee: TolgeeInstance | null = null

    constructor() {
        const saved = localStorage.getItem('fleet-lang')
        if (saved === 'fr' || saved === 'en' || saved === 'it') {
            this.lang.set(saved)
        }
        this.initTolgee()
    }

    setLang(lang: Lang): void {
        this.lang.set(lang)
        localStorage.setItem('fleet-lang', lang)
        this.tolgee?.changeLanguage(lang).catch(() => {})
    }

    private initTolgee(): void {
        const apiKey = getApiKey()
        const apiUrl = getApiUrl()

        const instance = (Tolgee()
            .use(FormatSimple())
            .use(BackendFetch({ prefix: `${apiUrl}/v2/projects/43/i18n` }))
            .use(LanguageStorage())
            .init({
                language: this.lang(),
                availableLanguages: ['fr', 'en', 'it'],
                defaultLanguage: 'fr',
                staticData: STATIC,
                apiKey,
                apiUrl,
            })) as unknown as TolgeeInstance

        this.tolgee = instance
        instance.run().catch(() => {})
    }
}
