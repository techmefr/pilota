import { ref } from 'vue'
import type { PilotaEventHandler } from '@pilota/core'
import { sdk } from '../utils/sdk'

export type ChatMessage = {
    id?: string
    content: string
    author: 'client' | 'bot'
    created_at: string
}

const messages = ref<ChatMessage[]>([])
const isConnected = ref(false)
let cleanup: (() => void) | null = null

type MessagesApi = {
    subscribe: (p: object, handler: PilotaEventHandler) => () => void
    insert: (p: object) => Promise<unknown>
}
const messagesApi = (sdk.supabase as unknown as { messages: MessagesApi }).messages

export function useChat() {
    function connect(): void {
        if (cleanup !== null) return
        cleanup = messagesApi.subscribe(
            { room_id: 'sav' },
            (event, data) => {
                if (event === 'connected') isConnected.value = true
                if (event === 'data' && data) {
                    const payload = data as { eventType: string; new: ChatMessage }
                    if (payload.eventType === 'INSERT' && payload.new.author !== 'client') {
                        messages.value.push(payload.new)
                    }
                }
                if (event === 'disconnected') isConnected.value = false
            },
        )
    }

    function disconnect(): void {
        cleanup?.()
        cleanup = null
        isConnected.value = false
    }

    async function send(content: string): Promise<void> {
        const msg: ChatMessage = {
            content,
            author: 'client',
            created_at: new Date().toISOString(),
        }
        messages.value.push(msg)
        await messagesApi.insert({
            room_id: 'sav',
            content,
            author: 'client',
        }).catch(() => null)
    }

    return { messages, isConnected, connect, disconnect, send }
}
