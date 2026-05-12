<script setup lang="ts">
import { ref } from 'vue'
import { useResourceForm } from '@pilota/hooks'
import { sdk, userResource } from '../utils/sdk'

const { values, errors, isDirty, handleSubmit, setServerErrors, reset } =
    useResourceForm(userResource)

const submitStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const submitResponse = ref<unknown>(null)

const onSubmit = handleSubmit(async data => {
    submitStatus.value = 'loading'
    try {
        const result = await sdk.lomkit.users.mutate(data, (event, payload) => {
            if (event === 'error' && payload && typeof payload === 'object' && 'errors' in payload) {
                setServerErrors((payload as { errors: Record<string, string[]> }).errors)
            }
        }) as unknown
        submitResponse.value = result
        submitStatus.value = 'success'
    } catch {
        submitStatus.value = 'error'
    }
})
</script>

<template>
    <div>
        <h2 class="text-h5 mb-1">POC 7 — useResourceForm</h2>
        <p class="text-medium-emphasis mb-4">
            Formulaire typé par le schema Zod. Erreurs Vuetify. isDirty. Reset. Erreurs serveur injectées.
        </p>

        <v-row>
            <v-col cols="12" md="6">
                <v-form @submit.prevent="onSubmit">
                    <v-text-field
                        v-model="values.name"
                        label="Nom"
                        :error-messages="errors.name"
                        density="compact"
                        class="mb-2"
                    />
                    <v-text-field
                        v-model="values.email"
                        label="Email"
                        :error-messages="errors.email"
                        density="compact"
                        class="mb-4"
                    />

                    <div class="d-flex gap-2 align-center mb-4">
                        <v-chip :color="isDirty ? 'warning' : 'success'" size="small">
                            {{ isDirty ? 'modifié' : 'propre' }}
                        </v-chip>
                        <v-btn
                            type="submit"
                            color="primary"
                            size="small"
                            :loading="submitStatus === 'loading'"
                        >
                            Soumettre
                        </v-btn>
                        <v-btn size="small" variant="text" @click="reset">Reset</v-btn>
                    </div>
                </v-form>

                <v-card variant="outlined" class="text-caption">
                    <v-card-text>
                        <div class="mb-1 text-medium-emphasis">values</div>
                        <pre>{{ JSON.stringify(values, null, 2) }}</pre>
                        <div class="mt-2 mb-1 text-medium-emphasis">errors</div>
                        <pre>{{ JSON.stringify(errors, null, 2) }}</pre>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <PocResult
                    title="Réponse serveur"
                    :status="submitStatus"
                    :response="submitResponse"
                />
            </v-col>
        </v-row>
    </div>
</template>
