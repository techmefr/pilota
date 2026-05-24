import { Tolgee, DevTools, LanguageStorage } from '@tolgee/web'

export type Lang = 'fr' | 'en'

export const tolgee = Tolgee()
    .use(DevTools())
    .use(LanguageStorage())
    .init({
        language: 'fr',
        availableLanguages: ['fr', 'en'],
        apiUrl: import.meta.env.PUBLIC_TOLGEE_API_URL,
        apiKey: import.meta.env.PUBLIC_TOLGEE_API_KEY,
    })

tolgee.run()
