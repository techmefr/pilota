import { Tolgee, DevTools, LanguageStorage } from '@tolgee/web'
import fr from '../../i18n/fr.json'
import en from '../../i18n/en.json'

export type Lang = 'fr' | 'en'

export const tolgee = Tolgee()
    .use(DevTools())
    .use(LanguageStorage())
    .init({
        language: 'fr',
        apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL,
        apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
        staticData: { fr, en },
    })
