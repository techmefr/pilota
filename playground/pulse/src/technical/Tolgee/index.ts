import { Tolgee, DevTools, LanguageStorage } from '@tolgee/web'

export type Lang = 'fr' | 'en'

export const tolgee = Tolgee()
    .use(DevTools())
    .use(LanguageStorage())
    .init({
        language: 'fr',
        apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL,
        apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
    })
