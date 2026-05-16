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
                            primary: '#7C6AF7',
                            secondary: '#A855F7',
                            error: '#F87171',
                            warning: '#FB923C',
                            success: '#34D399',
                            info: '#60A5FA',
                            background: '#060608',
                            surface: '#0E0E12',
                            'surface-variant': '#16161E',
                            'on-background': '#F0F0F5',
                            'on-surface': '#F0F0F5',
                            'on-primary': '#FFFFFF',
                        },
                    },
                    light: {
                        dark: false,
                        colors: {
                            primary: '#5245E5',
                            secondary: '#7C3AED',
                            error: '#DC2626',
                            warning: '#EA580C',
                            success: '#059669',
                            info: '#2563EB',
                            background: '#F2F2F7',
                            surface: '#FFFFFF',
                            'surface-variant': '#E8E8F0',
                            'on-background': '#08080F',
                            'on-surface': '#08080F',
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
