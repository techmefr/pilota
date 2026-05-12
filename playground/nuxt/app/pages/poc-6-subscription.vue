<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { sdk } from '../utils/sdk'

const ROOM_ID = 'room-1'

const nhostMessages = ref<unknown[]>([])
const nhostConnected = ref(false)
let nhostCleanup: (() => void) | null = null

const supabaseMessages = ref<unknown[]>([])
const supabaseConnected = ref(false)
let supabaseCleanup: (() => void) | null = null

function subscribeNhost(): void {
    nhostMessages.value = []
    nhostCleanup = sdk.nhost.messages.subscription(
        { room_id: ROOM_ID },
        (event, data) => {
            if (event === 'connected') nhostConnected.value = true
            if (event === 'data') nhostMessages.value.unshift(data)
            if (event === 'disconnected') nhostConnected.value = false
        },
    ) as () => void
}

function unsubscribeNhost(): void {
    nhostCleanup?.()
    nhostCleanup = null
    nhostConnected.value = false
}

function subscribeSupabase(): void {
    supabaseMessages.value = []
    supabaseCleanup = sdk.supabase.messages.subscribe(
        { room_id: ROOM_ID },
        (event, data) => {
            if (event === 'connected') supabaseConnected.value = true
            if (event === 'data') supabaseMessages.value.unshift(data)
            if (event === 'disconnected') supabaseConnected.value = false
        },
    ) as () => void
}

function unsubscribeSupabase(): void {
    supabaseCleanup?.()
    supabaseCleanup = null
    supabaseConnected.value = false
}

onUnmounted(() => {
    nhostCleanup?.()
    supabaseCleanup?.()
})
</script>

<template>
    <div data-test-id="page-poc-6">
        <h2 class="text-h5 mb-1">POC 6 — Subscriptions / Realtime</h2>
        <p class="text-medium-emphasis mb-4">
            Les méthodes reactive retournent un cleanup. Room : <code>{{ ROOM_ID }}</code>
        </p>

        <v-row>
            <v-col cols="12" md="6">
                <v-card variant="outlined">
                    <v-card-title class="d-flex align-center gap-2 text-body-1">
                        Nhost (GraphQL WS)
                        <v-chip
                            data-test-id="nhost-status-chip"
                            :data-test-state="nhostConnected ? 'connected' : 'disconnected'"
                            :color="nhostConnected ? 'success' : 'default'"
                            size="x-small"
                        >
                            {{ nhostConnected ? 'connecté' : 'déconnecté' }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        <div class="d-flex gap-2 mb-3">
                            <v-btn
                                data-test-id="btn-nhost-subscribe"
                                size="small"
                                color="primary"
                                variant="outlined"
                                :disabled="nhostConnected"
                                @click="subscribeNhost"
                            >
                                Subscribe
                            </v-btn>
                            <v-btn
                                data-test-id="btn-nhost-unsubscribe"
                                size="small"
                                color="error"
                                variant="outlined"
                                :disabled="!nhostConnected"
                                @click="unsubscribeNhost"
                            >
                                Unsubscribe
                            </v-btn>
                        </div>

                        <div class="text-caption text-medium-emphasis mb-1">Messages reçus</div>
                        <div v-if="nhostMessages.length === 0" class="text-body-2 text-medium-emphasis">
                            En attente…
                        </div>
                        <div
                            v-for="(msg, i) in nhostMessages"
                            :key="i"
                            class="text-body-2 mb-1"
                        >
                            {{ JSON.stringify(msg) }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card variant="outlined">
                    <v-card-title class="d-flex align-center gap-2 text-body-1">
                        Supabase (Realtime)
                        <v-chip
                            data-test-id="supabase-status-chip"
                            :data-test-state="supabaseConnected ? 'connected' : 'disconnected'"
                            :color="supabaseConnected ? 'success' : 'default'"
                            size="x-small"
                        >
                            {{ supabaseConnected ? 'connecté' : 'déconnecté' }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        <div class="d-flex gap-2 mb-3">
                            <v-btn
                                data-test-id="btn-supabase-subscribe"
                                size="small"
                                color="primary"
                                variant="outlined"
                                :disabled="supabaseConnected"
                                @click="subscribeSupabase"
                            >
                                Subscribe
                            </v-btn>
                            <v-btn
                                data-test-id="btn-supabase-unsubscribe"
                                size="small"
                                color="error"
                                variant="outlined"
                                :disabled="!supabaseConnected"
                                @click="unsubscribeSupabase"
                            >
                                Unsubscribe
                            </v-btn>
                        </div>

                        <div class="text-caption text-medium-emphasis mb-1">Messages reçus</div>
                        <div v-if="supabaseMessages.length === 0" class="text-body-2 text-medium-emphasis">
                            En attente…
                        </div>
                        <div
                            v-for="(msg, i) in supabaseMessages"
                            :key="i"
                            class="text-body-2 mb-1"
                        >
                            {{ JSON.stringify(msg) }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
