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

    runtimeConfig: {
        public: {
            tolgeeApiUrl: '',
            tolgeeApiKey: '',
        },
    },

    future: {
        compatibilityVersion: 4,
    },

    ssr: false,

    vite: {
        viteNode: {
            // Workaround: abstract Unix sockets (\0...) get truncated when
            // stored in env vars on Linux — force tmpdir path instead
            socketPath: `/tmp/nuxt-vite-node-${process.pid}.sock`,
        } as object,
    },
})
