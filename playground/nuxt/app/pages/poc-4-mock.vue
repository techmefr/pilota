<script setup lang="ts">
import { ref } from 'vue'
import { sdk, userResource } from '../utils/sdk'

type Status = 'idle' | 'loading' | 'success' | 'error'

const VALID_MOCK = { id: 99, name: 'Mock User', email: 'mock@pilota.dev' }
const INVALID_MOCK = { id: 'not-a-valid-id', name: 42, email: 'not-an-email' }

const mockEnabled = ref(true)

const status = ref<Status>('idle')
const response = ref<unknown>(null)
const error = ref<unknown>(null)
const usedMock = ref<unknown>(null)

async function call(): Promise<void> {
    status.value = 'loading'
    response.value = null
    error.value = null

    const mock = mockEnabled.value ? VALID_MOCK : undefined
    usedMock.value = mock ?? null

    try {
        const result = await sdk.lomkit.users.get({ id: 1 }, undefined, mock) as unknown
        response.value = result
        status.value = 'success'
    } catch (e) {
        error.value = e
        status.value = 'error'
    }
}

async function callWithInvalidMock(): Promise<void> {
    status.value = 'loading'
    response.value = null
    error.value = null
    usedMock.value = INVALID_MOCK

    try {
        userResource.schema.parse(INVALID_MOCK)
        status.value = 'idle'
    } catch (e) {
        error.value = { message: 'Mock invalide — Zod a rejeté les données', details: e }
        status.value = 'error'
    }
}
</script>

<template>
    <div data-test-id="page-poc-4">
        <h2 class="text-h5 mb-1">POC 4 — Mock par appel</h2>
        <p class="text-medium-emphasis mb-4">
            Le 3e argument de chaque méthode court-circuite l'appel réseau.
            Le mock est validé par Zod au runtime.
        </p>

        <v-row class="mb-2">
            <v-col cols="auto">
                <v-switch
                    v-model="mockEnabled"
                    data-test-id="mock-switch"
                    :data-test-state="mockEnabled ? 'on' : 'off'"
                    label="Mock activé"
                    color="primary"
                    hide-details
                    density="compact"
                />
            </v-col>
        </v-row>

        <div class="d-flex gap-2 flex-wrap mb-4">
            <v-btn
                data-test-id="btn-call"
                color="primary"
                variant="outlined"
                :loading="status === 'loading'"
                @click="call"
            >
                sdk.lomkit.users.get(…, onEvent, {{ mockEnabled ? 'VALID_MOCK' : 'undefined' }})
            </v-btn>
            <v-btn
                data-test-id="btn-invalid-mock"
                color="error"
                variant="outlined"
                @click="callWithInvalidMock"
            >
                Tester mock invalide (Zod)
            </v-btn>
        </div>

        <v-row v-if="status !== 'idle'">
            <v-col v-if="usedMock !== null" cols="12" md="6">
                <v-card variant="outlined" class="mb-3">
                    <v-card-title class="text-body-1">Mock passé</v-card-title>
                    <v-card-text>
                        <pre data-test-id="mock-preview" class="code-block">{{ JSON.stringify(usedMock, null, 2) }}</pre>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <PocResult
                    data-test-id="result-mock"
                    title="Résultat"
                    :status="status"
                    :response="response"
                    :error="error"
                />
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
.code-block {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 12px;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
}
</style>
