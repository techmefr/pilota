export default defineNuxtConfig({
    extends: ['./layers/technical', './layers/functional'],

    css: ['~/assets/grain.css'],

    modules: ['vuetify-nuxt-module', '@sentry/nuxt/module'],

    sentry: {
        sourceMapsUploadOptions: { disable: true },
    },

    app: {
        head: {
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap',
                },
            ],
        },
    },

    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark',
                themes: {
                    dark: {
                        dark: true,
                        colors: {
                            primary: '#008060',
                            secondary: '#36F4A4',
                            error: '#EE0004',
                            warning: '#E89900',
                            success: '#15883B',
                            info: '#3B82F6',
                            background: '#02090A',
                            surface: '#061A1C',
                            'surface-variant': '#121C1E',
                            'on-background': '#FFFFFF',
                            'on-surface': '#FFFFFF',
                            'on-primary': '#FFFFFF',
                            'on-secondary': '#02090A',
                        },
                    },
                    light: {
                        dark: false,
                        colors: {
                            primary: '#008060',
                            secondary: '#36F4A4',
                            error: '#EE0004',
                            warning: '#E89900',
                            success: '#15883B',
                            info: '#3B82F6',
                            background: '#FFFFFF',
                            surface: '#FAFAFA',
                            'surface-variant': '#F4F4F5',
                            'on-background': '#18181B',
                            'on-surface': '#18181B',
                            'on-primary': '#FFFFFF',
                            'on-secondary': '#02090A',
                        },
                    },
                },
            },
            defaults: {
                VCard: { rounded: 'xl', elevation: 0 },
                VBtn: { rounded: 'lg' },
                VChip: { rounded: 'md' },
                VTextField: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
                VTextarea: { variant: 'outlined', density: 'comfortable', rounded: 'lg' },
            },
        },
    },

    runtimeConfig: {
        public: {
            tolgeeApiUrl: '',
            tolgeeApiKey: '',
            sentryDsn: '',
        },
    },

    future: {
        compatibilityVersion: 4,
    },

    routeRules: {
        '/**': { ssr: false },
    },

    devServer: {
        host: '0.0.0.0',
        port: 3000,
    },

    vite: {
        server: {
            allowedHosts: 'all',
        },
    },
})
