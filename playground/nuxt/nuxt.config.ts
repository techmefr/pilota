export default defineNuxtConfig({
    modules: ['vuetify-nuxt-module'],

    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark',
                themes: {
                    dark: {
                        dark: true,
                        colors: {
                            primary: '#6366f1',
                            secondary: '#8b5cf6',
                            error: '#ef4444',
                            warning: '#f59e0b',
                            success: '#22c55e',
                            info: '#3b82f6',
                            background: '#09090b',
                            surface: '#18181b',
                            'surface-variant': '#27272a',
                            'on-background': '#fafafa',
                            'on-surface': '#fafafa',
                        },
                    },
                },
            },
            defaults: {
                VCard: { rounded: 'lg' },
                VBtn: { rounded: 'lg' },
                VChip: { rounded: 'md' },
                VTextField: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
            },
        },
    },

    future: {
        compatibilityVersion: 4,
    },

    ssr: false,
})
