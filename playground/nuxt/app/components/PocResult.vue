<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    title: string
    status: 'idle' | 'loading' | 'success' | 'error'
    payload?: unknown
    response?: unknown
    error?: unknown
    events?: Array<{ event: string; data?: unknown }>
}>()

const statusColor = computed(
    () =>
        ({
            idle: 'default' as const,
            loading: 'info' as const,
            success: 'success' as const,
            error: 'error' as const,
        })[props.status],
)
</script>

<template>
    <v-card variant="outlined" class="mt-4" :data-test-state="status">
        <v-card-title class="d-flex align-center gap-2 py-3">
            <v-chip :color="statusColor" size="small" class="text-uppercase">{{ status }}</v-chip>
            <span class="text-body-1">{{ title }}</span>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
            <div v-if="payload !== undefined" class="mb-4">
                <div class="text-caption text-medium-emphasis mb-1">PAYLOAD</div>
                <pre class="code-block">{{ JSON.stringify(payload, null, 2) }}</pre>
            </div>

            <div v-if="response !== undefined" class="mb-4">
                <div class="text-caption text-medium-emphasis mb-1">RÉPONSE</div>
                <pre class="code-block">{{ JSON.stringify(response, null, 2) }}</pre>
            </div>

            <div v-if="error !== undefined" class="mb-4">
                <div class="text-caption text-error mb-1">ERREUR</div>
                <pre class="code-block text-error">{{ JSON.stringify(error, null, 2) }}</pre>
            </div>

            <div v-if="events && events.length > 0">
                <div class="text-caption text-medium-emphasis mb-1">EVENTS</div>
                <div class="code-block">
                    <div
                        v-for="(e, i) in events"
                        :key="i"
                        class="d-flex gap-2 text-body-2"
                    >
                        <span class="text-primary font-weight-bold">{{ e.event }}</span>
                        <span class="text-medium-emphasis">{{ JSON.stringify(e.data) }}</span>
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<style scoped>
.code-block {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 12px;
    font-family: monospace;
    font-size: 12px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
}
</style>
