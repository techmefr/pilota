export default defineNuxtConfig({
    modules: ['vuetify-nuxt-module'],

    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark',
            },
        },
    },

    future: {
        compatibilityVersion: 4,
    },

    ssr: false,
})
