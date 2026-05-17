export default defineNuxtConfig({
    extends: ['./layers/technical', './layers/functional'],

    css: ['~/assets/grain.css'],

    modules: ['vuetify-nuxt-module'],

    app: {
        head: {
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap',
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
                            primary: '#D4882A',
                            secondary: '#4AADA8',
                            error: '#E57373',
                            warning: '#E8924A',
                            success: '#52B788',
                            info: '#5B9BD5',
                            background: '#0B0906',
                            surface: '#141108',
                            'surface-variant': '#1D1A10',
                            'on-background': '#F2EEE4',
                            'on-surface': '#F2EEE4',
                            'on-primary': '#1A0E00',
                        },
                    },
                    light: {
                        dark: false,
                        colors: {
                            primary: '#9E5C00',
                            secondary: '#287C78',
                            error: '#C62828',
                            warning: '#C75B00',
                            success: '#2E7D5A',
                            info: '#1A5FA8',
                            background: '#FAF7F0',
                            surface: '#FFFFFE',
                            'surface-variant': '#F1EDE0',
                            'on-background': '#1A1508',
                            'on-surface': '#1A1508',
                            'on-primary': '#FFFFFF',
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
