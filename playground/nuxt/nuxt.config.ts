export default defineNuxtConfig({
    modules: ['vuetify-nuxt-module'],

    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark',
                themes: {
                    dark: {
                        colors: {
                            primary: '#00BCD4',
                            secondary: '#FF4081',
                            surface: '#1a1a2e',
                            background: '#0f0f23',
                        },
                    },
                },
            },
        },
    },

    future: {
        compatibilityVersion: 4,
    },

    ssr: false,
})
