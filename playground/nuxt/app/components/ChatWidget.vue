<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useChat } from '../composables/useChat'

const open = ref(false)
const input = ref('')
const messagesEl = ref<HTMLElement | null>(null)

const { messages, isConnected, connect, disconnect, send } = useChat()

function toggle(): void {
    open.value = !open.value
    if (open.value) connect()
    else disconnect()
}

async function submit(): Promise<void> {
    const content = input.value.trim()
    if (content === '') return
    input.value = ''
    await send(content)
    await nextTick()
    if (messagesEl.value !== null) {
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
}
</script>

<template>
    <div>
        <v-btn
            data-test-id="chat-fab"
            :color="open ? 'error' : 'primary'"
            :icon="open ? 'mdi-close' : 'mdi-chat-outline'"
            position="fixed"
            location="bottom right"
            style="bottom: 24px; right: 24px; z-index: 1000;"
            size="large"
            elevation="4"
            @click="toggle"
        />

        <v-card
            v-if="open"
            data-test-id="chat-window"
            position="fixed"
            style="bottom: 88px; right: 24px; width: 340px; z-index: 999;"
            elevation="8"
            border
        >
            <v-card-title class="d-flex align-center gap-2 py-3 px-4 border-b">
                <v-icon color="primary" size="20">mdi-headset</v-icon>
                <span class="text-body-1 font-weight-medium">Service client</span>
                <v-spacer />
                <v-chip
                    data-test-id="chat-status"
                    :data-test-state="isConnected ? 'connected' : 'connecting'"
                    :color="isConnected ? 'success' : 'warning'"
                    size="x-small"
                    variant="tonal"
                >
                    {{ isConnected ? 'En ligne' : 'Connexion…' }}
                </v-chip>
            </v-card-title>

            <div
                ref="messagesEl"
                data-test-id="chat-messages"
                class="chat-messages pa-3"
            >
                <div
                    v-if="messages.length === 0"
                    data-test-id="chat-empty"
                    class="text-body-2 text-medium-emphasis text-center py-4"
                >
                    Bonjour ! Comment puis-je vous aider ?
                </div>
                <div
                    v-for="(msg, i) in messages"
                    :key="i"
                    :data-test-class="'chat-message'"
                    :class="['d-flex mb-2', msg.author === 'client' ? 'justify-end' : 'justify-start']"
                >
                    <div
                        :class="[
                            'chat-bubble px-3 py-2 rounded-lg text-body-2',
                            msg.author === 'client' ? 'bg-primary text-white' : 'bg-surface-variant'
                        ]"
                    >
                        {{ msg.content }}
                    </div>
                </div>
            </div>

            <v-card-text class="pa-2 border-t">
                <v-text-field
                    v-model="input"
                    data-test-id="chat-input"
                    placeholder="Votre message…"
                    density="compact"
                    variant="outlined"
                    hide-details
                    :append-inner-icon="'mdi-send'"
                    @click:append-inner="submit"
                    @keydown.enter="submit"
                />
            </v-card-text>
        </v-card>
    </div>
</template>

<style scoped>
.chat-messages {
    height: 280px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}
.chat-bubble {
    max-width: 80%;
    word-break: break-word;
}
</style>
