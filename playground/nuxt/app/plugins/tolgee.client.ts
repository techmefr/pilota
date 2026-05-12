import { Tolgee, FormatSimple, DevTools } from '@tolgee/web'
import { VueTolgee } from '@tolgee/vue'
import en from '../i18n/en.json'
import fr from '../i18n/fr.json'

export default defineNuxtPlugin(async nuxtApp => {
    const { tolgeeApiUrl, tolgeeApiKey } = useRuntimeConfig().public

    const tolgee = await Tolgee()
        .use(FormatSimple())
        .use(DevTools())
        .init({
            language: 'en',
            availableLanguages: ['en', 'fr'],
            staticData: { en, fr },
            ...(tolgeeApiUrl ? { apiUrl: String(tolgeeApiUrl) } : {}),
            ...(tolgeeApiKey ? { apiKey: String(tolgeeApiKey) } : {}),
        })

    nuxtApp.vueApp.use(VueTolgee, { tolgee })
})
