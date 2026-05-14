<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useTranslate } from '@tolgee/vue'

const open = ref(false)
const input = ref('')
const messagesEl = ref<HTMLElement | null>(null)

const { messages, isConnected, connect, disconnect, send } = useChat()
const { t } = useTranslate()

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
    <div class="chat-root">
        <!-- Chat window -->
        <Transition name="chat-pop">
            <div v-if="open" class="chat-window" data-test-id="chat-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-avatar">
                            <v-icon size="18" color="primary">mdi-headset</v-icon>
                        </div>
                        <div>
                            <p class="chat-header-title">{{ t('Customer service') }}</p>
                            <div class="chat-status" data-test-id="chat-status" :data-test-state="isConnected ? 'connected' : 'connecting'">
                                <span class="chat-dot" :class="{ connected: isConnected }" />
                                <span class="chat-status-text">{{ isConnected ? t('Online') : t('Connecting…') }}</span>
                            </div>
                        </div>
                    </div>
                    <button class="chat-close" @click="toggle">
                        <v-icon size="16">mdi-close</v-icon>
                    </button>
                </div>

                <div ref="messagesEl" class="chat-messages" data-test-id="chat-messages">
                    <div v-if="messages.length === 0" data-test-id="chat-empty" class="chat-empty">
                        <v-icon size="28" color="primary" class="mb-3" style="opacity: 0.4;">mdi-chat-outline</v-icon>
                        <p>{{ t('Hello! How can I help you?') }}</p>
                    </div>

                    <div
                        v-for="(msg, i) in messages"
                        :key="i"
                        :data-test-class="'chat-message'"
                        class="chat-msg-row"
                        :class="msg.author === 'client' ? 'from-client' : 'from-bot'"
                    >
                        <div class="chat-bubble" :class="msg.author === 'client' ? 'bubble-client' : 'bubble-bot'">
                            {{ msg.content }}
                        </div>
                    </div>
                </div>

                <div class="chat-input-row">
                    <input
                        v-model="input"
                        class="chat-input"
                        data-test-id="chat-input"
                        :placeholder="t('Your message…')"
                        @keydown.enter="submit"
                    />
                    <button class="chat-send" :disabled="input.trim() === ''" @click="submit">
                        <v-icon size="16">mdi-send</v-icon>
                    </button>
                </div>
            </div>
        </Transition>

        <!-- FAB -->
        <button class="chat-fab" data-test-id="chat-fab" :class="{ open }" @click="toggle">
            <Transition name="spin" mode="out-in">
                <v-icon v-if="open" key="close" size="22">mdi-close</v-icon>
                <v-icon v-else key="chat" size="22">mdi-chat-outline</v-icon>
            </Transition>
        </button>
    </div>
</template>

<style scoped>
.chat-root {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
}

/* ─── FAB ─── */
.chat-fab {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(var(--v-theme-primary), 0.45);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    flex-shrink: 0;
}
.chat-fab:hover { transform: scale(1.1); box-shadow: 0 12px 32px rgba(var(--v-theme-primary), 0.55); }
.chat-fab.open { background: rgba(128, 128, 128, 0.2); box-shadow: none; color: rgb(var(--v-theme-on-background)); }

/* ─── Chat window ─── */
.chat-window {
    width: 320px;
    border-radius: 20px;
    background: rgb(var(--v-theme-surface));
    border: 1px solid rgba(128, 128, 128, 0.12);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Pop animation */
.chat-pop-enter-active { animation: chatIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.chat-pop-leave-active { animation: chatOut 0.2s ease both; }
@keyframes chatIn { from { opacity: 0; transform: scale(0.85) translateY(16px); transform-origin: bottom right; } }
@keyframes chatOut { to { opacity: 0; transform: scale(0.9) translateY(8px); transform-origin: bottom right; } }

/* Header */
.chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border-bottom: 1px solid rgba(128, 128, 128, 0.1);
}

.chat-header-info { display: flex; align-items: center; gap: 12px; }

.chat-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(var(--v-theme-primary), 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.chat-header-title {
    font-size: 13px;
    font-weight: 700;
    color: rgb(var(--v-theme-on-surface));
    margin-bottom: 2px;
}

.chat-status { display: flex; align-items: center; gap: 5px; }

.chat-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgb(var(--v-theme-warning));
    transition: background 0.3s;
}
.chat-dot.connected { background: rgb(var(--v-theme-success)); }

.chat-status-text {
    font-size: 11px;
    font-weight: 500;
    opacity: 0.55;
}

.chat-close {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    color: rgb(var(--v-theme-on-surface));
    opacity: 0.35;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s, background 0.15s;
}
.chat-close:hover { opacity: 0.8; background: rgba(128, 128, 128, 0.1); }

/* Messages */
.chat-messages {
    height: 260px;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.chat-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    font-size: 13px;
    opacity: 0.4;
}

.chat-msg-row { display: flex; }
.chat-msg-row.from-client { justify-content: flex-end; }
.chat-msg-row.from-bot { justify-content: flex-start; }

.chat-bubble {
    max-width: 78%;
    padding: 9px 13px;
    border-radius: 14px;
    font-size: 13px;
    line-height: 1.45;
    word-break: break-word;
}

.bubble-client {
    background: rgb(var(--v-theme-primary));
    color: #fff;
    border-bottom-right-radius: 4px;
}

.bubble-bot {
    background: rgba(128, 128, 128, 0.12);
    color: rgb(var(--v-theme-on-surface));
    border-bottom-left-radius: 4px;
}

/* Input */
.chat-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border-top: 1px solid rgba(128, 128, 128, 0.1);
}

.chat-input {
    flex: 1;
    height: 38px;
    border-radius: 100px;
    border: 1px solid rgba(128, 128, 128, 0.2);
    background: rgba(128, 128, 128, 0.06);
    padding: 0 14px;
    font-size: 13px;
    color: rgb(var(--v-theme-on-surface));
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
}
.chat-input:focus { border-color: rgba(var(--v-theme-primary), 0.5); }
.chat-input::placeholder { opacity: 0.35; }

.chat-send {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgb(var(--v-theme-primary));
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
}
.chat-send:hover { transform: scale(1.1); }
.chat-send:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

/* Spin (shared with app.vue global) */
.spin-enter-active, .spin-leave-active { transition: all 0.22s ease; }
.spin-enter-from { opacity: 0; transform: rotate(-120deg) scale(0.4); }
.spin-leave-to   { opacity: 0; transform: rotate(120deg) scale(0.4); }
</style>
