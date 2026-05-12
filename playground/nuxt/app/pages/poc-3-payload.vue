<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const ORIGINAL = {
    name: 'Alice Martin',
    email: 'alice@pilota.dev',
    bio: 'Développeuse fullstack',
    city: 'Paris',
    age: 28,
}

const current = reactive({ ...ORIGINAL })

const delta = computed(() => {
    const d: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(current)) {
        if (value !== ORIGINAL[key as keyof typeof ORIGINAL]) {
            d[key] = value
        }
    }
    return d
})

const isDirty = computed(() => Object.keys(delta.value).length > 0)

function reset(): void {
    Object.assign(current, ORIGINAL)
}
</script>

<template>
    <div data-test-id="page-poc-3">
        <h2 class="text-h5 mb-1">POC 3 — Payload Builder (delta)</h2>
        <p class="text-medium-emphasis mb-4">
            Seuls les champs modifiés sont inclus dans le payload. Les champs non touchés ne transitent pas.
        </p>

        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="current.name"
                    data-test-id="field-name"
                    label="Nom"
                    density="compact"
                    class="mb-2"
                />
                <v-text-field
                    v-model="current.email"
                    data-test-id="field-email"
                    label="Email"
                    density="compact"
                    class="mb-2"
                />
                <v-textarea
                    v-model="current.bio"
                    data-test-id="field-bio"
                    label="Bio"
                    rows="2"
                    density="compact"
                    class="mb-2"
                />
                <v-text-field
                    v-model="current.city"
                    data-test-id="field-city"
                    label="Ville"
                    density="compact"
                    class="mb-2"
                />
                <v-text-field
                    v-model.number="current.age"
                    data-test-id="field-age"
                    label="Âge"
                    type="number"
                    density="compact"
                    class="mb-2"
                />

                <div class="d-flex gap-2 mt-2">
                    <v-chip
                        data-test-id="dirty-chip"
                        :data-test-state="isDirty ? 'dirty' : 'clean'"
                        :color="isDirty ? 'warning' : 'success'"
                        size="small"
                    >
                        {{ isDirty ? 'modifié' : 'propre' }}
                    </v-chip>
                    <v-btn
                        data-test-id="btn-reset"
                        size="small"
                        variant="text"
                        @click="reset"
                    >Reset</v-btn>
                </div>
            </v-col>

            <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-3">
                    <v-card-title class="text-body-1">
                        Payload envoyé
                        <v-chip class="ml-2" size="x-small" color="primary">
                            {{ Object.keys(delta).length }} champ(s)
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        <pre data-test-id="delta-output" class="code-block">{{ JSON.stringify(delta, null, 2) }}</pre>
                    </v-card-text>
                </v-card>

                <v-card variant="outlined" class="opacity-50">
                    <v-card-title class="text-body-1 text-medium-emphasis">Champs non envoyés</v-card-title>
                    <v-card-text>
                        <v-chip
                            v-for="key in Object.keys(ORIGINAL)"
                            :key="key"
                            :class="{ 'opacity-30': key in delta }"
                            size="small"
                            class="mr-1"
                        >{{ key }}</v-chip>
                    </v-card-text>
                </v-card>
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
