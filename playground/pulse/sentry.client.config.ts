import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
    Sentry.init({
        dsn,
        tracesSampleRate: 0.1,
        integrations: [
            Sentry.feedbackIntegration({
                colorScheme: 'system',
                buttonLabel: 'Donner un avis',
                triggerLabel: 'Donner un avis',
                formTitle: 'Donnez-nous votre avis',
                submitButtonLabel: 'Envoyer',
                cancelButtonLabel: 'Annuler',
                nameLabel: 'Nom',
                namePlaceholder: 'Votre nom',
                emailLabel: 'Email',
                emailPlaceholder: 'votre@email.com',
                messageLabel: 'Message',
                messagePlaceholder: 'Décrivez votre problème ou suggestion...',
                isRequiredLabel: '(obligatoire)',
                successMessageText: 'Merci pour votre retour !',
            }),
        ],
    })
}
