import { ref } from 'vue'
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

export function useChat() {
    function connect(): void {
        if (cleanup !== null) return
        cleanup = sdk.supabase.messages.subscribe(
            { room_id: 'sav' },
            (event, data) => {
                if (event === 'connected') isConnected.value = true
                if (event === 'data' && data) {
                    const msg = data as ChatMessage
                    if (msg.author !== 'client') messages.value.push(msg)
                }
                if (event === 'disconnected') isConnected.value = false
            },
        ) as () => void
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
        await sdk.supabase.messages.insert({
            room_id: 'sav',
            content,
            author: 'client',
        }).catch(() => null)
    }

    return { messages, isConnected, connect, disconnect, send }
}
