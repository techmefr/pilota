import * as Sentry from '@sentry/angular'

declare global {
    interface Window {
        __fleet_env: {
            sentryDsn: string
            laravelApiUrl: string
            supabaseUrl: string
            nhostEndpoint: string
            tolgeeApiUrl: string
            tolgeeApiKey: string
        }
    }
}

const dsn = window.__fleet_env?.sentryDsn

if (dsn && dsn !== '%%SENTRY_DSN%%' && dsn.length > 0) {
    Sentry.init({
        dsn,
        tracesSampleRate: 0.2,
        environment: 'production',
    })
}
