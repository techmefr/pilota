import { ref } from 'vue'
import { createNotify } from 'beepr'
import type { PilotaNotifyAdapter } from 'beepr'

export type { PilotaNotifyAdapter }
export { createNotify }

type NotifType = 'success' | 'error' | 'info'

export type Notif = {
    id: number
    message: string
    type: NotifType
}

const queue = ref<Notif[]>([])
let uid = 0

export function useNotify() {
    function push(message: string, type: NotifType = 'info', duration = 3500): void {
        const id = ++uid
        queue.value.push({ id, message, type })
        setTimeout(() => {
            queue.value = queue.value.filter(n => n.id !== id)
        }, duration)
    }

    function dismiss(id: number): void {
        queue.value = queue.value.filter(n => n.id !== id)
    }

    return { queue, push, dismiss }
}

export function createSnackAdapter(opts: { success?: string; error?: string } = {}): PilotaNotifyAdapter {
    const { push } = useNotify()
    return {
        onSuccess: () => { if (opts.success) push(opts.success, 'success') },
        onError: err => push(opts.error ?? err.message, 'error'),
    }
}
