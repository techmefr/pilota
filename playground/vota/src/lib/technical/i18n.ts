import { Tolgee, DevTools, LanguageStorage } from '@tolgee/svelte'

export type Lang = 'fr' | 'en' | 'de'
export const LANG_LABELS: Record<Lang, string> = { fr: 'Français', en: 'English', de: 'Deutsch' }

export const tolgee = Tolgee()
    .use(DevTools())
    .use(LanguageStorage())
    .init({
        language: 'fr',
        apiUrl: import.meta.env.VITE_TOLGEE_API_URL,
        apiKey: import.meta.env.VITE_TOLGEE_API_KEY,
    })
