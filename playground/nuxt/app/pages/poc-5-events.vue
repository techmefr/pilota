<script setup lang="ts">
import { ref } from 'vue'
import { createPilotaHooks, resolveEventHandler } from '@pilota/hooks'
import { sdk } from '../utils/sdk'

type Status = 'idle' | 'loading' | 'success' | 'error'

const globalHooks = createPilotaHooks()

const events = ref<Array<{ event: string; data?: unknown; source: 'local' | 'global' }>>([])
const status = ref<Status>('idle')
const response = ref<unknown>(null)
const useLocal = ref(true)
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref<'success' | 'error'>('success')

globalHooks.hook('request', data => {
    events.value.push({ event: 'request', data, source: 'global' })
})
globalHooks.hook('success', data => {
    events.value.push({ event: 'success', data, source: 'global' })
    toastMessage.value = 'Requête réussie (hook global)'
    toastColor.value = 'success'
    showToast.value = true
})
globalHooks.hook('error', data => {
    events.value.push({ event: 'error', data, source: 'global' })
    toastMessage.value = 'Erreur (hook global)'
    toastColor.value = 'error'
    showToast.value = true
})

function localHandler(event: string, data?: unknown): void {
    events.value.push({ event, data, source: 'local' })
    if (event === 'request') status.value = 'loading'
    if (event === 'success') status.value = 'success'
    if (event === 'error') status.value = 'error'
}

async function callWithEvents(): Promise<void> {
    events.value = []
    status.value = 'idle'
    response.value = null

    const handler = resolveEventHandler(
        useLocal.value ? localHandler : undefined,
        globalHooks,
    )

    try {
        const result = await sdk.lomkit.users.get({}, handler) as unknown
        response.value = result
        if (!useLocal.value) status.value = 'success'
    } catch (e) {
        if (!useLocal.value) status.value = 'error'
    }
}
</script>

<template>
    <div>
        <h2 class="text-h5 mb-1">POC 5 — Moteur d'events</h2>
        <p class="text-medium-emphasis mb-4">
            Local handler a la priorité sur les hooks globaux.
            Sans local handler, les hooks globaux déclenchent loader + toast.
        </p>

        <v-row class="mb-2" align="center">
            <v-col cols="auto">
                <v-switch
                    v-model="useLocal"
                    :label="useLocal ? 'Handler local actif' : 'Hooks globaux actifs'"
                    color="primary"
                    hide-details
                    density="compact"
                />
            </v-col>
            <v-col cols="auto">
                <v-btn
                    color="primary"
                    variant="outlined"
                    :loading="status === 'loading'"
                    @click="callWithEvents"
                >
                    Appeler sdk.lomkit.users.get
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="6">
                <PocResult
                    title="Résultat"
                    :status="status"
                    :response="response"
                />
            </v-col>

            <v-col cols="12" md="6">
                <v-card variant="outlined">
                    <v-card-title class="text-body-1">Events reçus</v-card-title>
                    <v-card-text>
                        <div v-if="events.length === 0" class="text-medium-emphasis text-body-2">
                            Aucun event pour l'instant
                        </div>
                        <div
                            v-for="(e, i) in events"
                            :key="i"
                            class="d-flex gap-2 align-center mb-1"
                        >
                            <v-chip
                                :color="e.source === 'local' ? 'primary' : 'secondary'"
                                size="x-small"
                            >
                                {{ e.source }}
                            </v-chip>
                            <span class="font-weight-bold text-body-2">{{ e.event }}</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-snackbar v-model="showToast" :color="toastColor" timeout="3000">
            {{ toastMessage }}
        </v-snackbar>
    </div>
</template>
