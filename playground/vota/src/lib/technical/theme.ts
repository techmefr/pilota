import { writable } from 'svelte/store'

export type Theme = 'dark' | 'light'

const browser = typeof window !== 'undefined'
const stored = browser ? (localStorage.getItem('vota_theme') as Theme | null) : null
const preferred: Theme = browser && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
const initial: Theme = stored ?? preferred

export const theme = writable<Theme>(initial)

if (browser) {
    theme.subscribe(t => {
        localStorage.setItem('vota_theme', t)
        document.documentElement.setAttribute('data-theme', t)
    })
}
