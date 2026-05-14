import { ref } from 'vue'
import type { PilotaEventHandler } from '@pilota/core'

export type ChatMessage = {
    id?: string
    content: string
    author: 'client' | 'bot'
    created_at: string
}

const LOREM_REPLIES = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
    'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
    'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.',
    'Nullam varius, turpis molestie dictum euismod, diam quam.',
    'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
]

const messages = ref<ChatMessage[]>([])
const isConnected = ref(false)
let cleanup: (() => void) | null = null

type MessagesApi = {
    subscribe: (p: object, handler: PilotaEventHandler) => () => void
    insert: (p: object) => Promise<unknown>
}
const messagesApi = (sdk.supabase as unknown as { messages: MessagesApi }).messages

function randomLoremReply(): ChatMessage {
    const index = Math.floor(Math.random() * LOREM_REPLIES.length)
    return {
        content: LOREM_REPLIES[index] ?? LOREM_REPLIES[0]!,
        author: 'bot',
        created_at: new Date().toISOString(),
    }
}

export function useChat() {
    function connect(): void {
        if (cleanup !== null) return
        isConnected.value = true
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

        setTimeout(() => {
            messages.value.push(randomLoremReply())
        }, 800 + Math.random() * 1200)
    }

    return { messages, isConnected, connect, disconnect, send }
}
