import { Tolgee, DevTools, LanguageStorage } from '@tolgee/svelte'
import fr from './i18n/fr.json'
import en from './i18n/en.json'

export type Lang = 'fr' | 'en' | 'de'
export const LANG_LABELS: Record<Lang, string> = { fr: 'Français', en: 'English', de: 'Deutsch' }

const apiUrl = import.meta.env.VITE_TOLGEE_API_URL as string | undefined
const apiKey = import.meta.env.VITE_TOLGEE_API_KEY as string | undefined

const builder = Tolgee()
    .use(LanguageStorage())

if (apiUrl && apiKey) {
    builder.use(DevTools())
}

export const tolgee = builder.init({
    language: 'fr',
    staticData: { fr, en },
    ...(apiUrl && apiKey ? { apiUrl, apiKey } : {}),
})
