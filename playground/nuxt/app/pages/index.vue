<script setup lang="ts">
const pocs = [
    {
        to: '/poc-1-driver',
        title: 'POC 1 — Driver + chainage',
        subtitle: 'Deux drivers coexistent, chainage typé, zéro any',
        icon: 'mdi-transit-connection-variant',
    },
    {
        to: '/poc-2-resource',
        title: 'POC 2 — Resource + schema',
        subtitle: 'defineResource, Zod, fragments GraphQL',
        icon: 'mdi-database-outline',
    },
    {
        to: '/poc-3-payload',
        title: 'POC 3 — Payload Builder',
        subtitle: 'Seul le delta est envoyé, pas tout le formulaire',
        icon: 'mdi-delta',
    },
    {
        to: '/poc-4-mock',
        title: 'POC 4 — Mock',
        subtitle: 'Mock par appel, mock invalide, toggle',
        icon: 'mdi-test-tube',
    },
    {
        to: '/poc-5-events',
        title: 'POC 5 — Moteur d\'events',
        subtitle: 'request / success / error, local vs global hooks',
        icon: 'mdi-lightning-bolt',
    },
    {
        to: '/poc-6-subscription',
        title: 'POC 6 — Subscriptions',
        subtitle: 'Realtime Nhost + Supabase, cleanup',
        icon: 'mdi-wifi',
    },
    {
        to: '/poc-7-form',
        title: 'POC 7 — defineForm',
        subtitle: 'useResourceForm, isDirty, erreurs Vuetify, reset',
        icon: 'mdi-form-select',
    },
]
</script>

<template>
    <div>
        <h1 class="text-h4 font-weight-bold mb-2">Pilota POC</h1>
        <p class="text-medium-emphasis mb-6">
            SDK Driver-Based Architecture — <code>sdk.[driver].[resource].[method](payload?, onEvent?, mock?)</code>
        </p>

        <v-list lines="two" class="rounded border">
            <template v-for="(poc, i) in pocs" :key="poc.to">
                <v-list-item
                    :to="poc.to"
                    :prepend-icon="poc.icon"
                    :title="poc.title"
                    :subtitle="poc.subtitle"
                    nav
                />
                <v-divider v-if="i < pocs.length - 1" />
            </template>
        </v-list>
    </div>
</template>
