import { Injectable, signal } from '@angular/core'

export type Theme = 'dark' | 'light'
export type FontSize = 'sm' | 'md' | 'lg'

const FONT_SIZES: Record<FontSize, string> = { sm: '12px', md: '14px', lg: '16px' }

@Injectable({ providedIn: 'root' })
export class SettingsService {
    readonly theme = signal<Theme>(this.loadTheme())
    readonly fontSize = signal<FontSize>(this.loadFontSize())

    constructor() {
        this.applyTheme(this.theme())
        this.applyFontSize(this.fontSize())
    }

    setTheme(theme: Theme): void {
        this.theme.set(theme)
        localStorage.setItem('fleet-theme', theme)
        this.applyTheme(theme)
    }

    setFontSize(size: FontSize): void {
        this.fontSize.set(size)
        localStorage.setItem('fleet-font-size', size)
        this.applyFontSize(size)
    }

    private applyTheme(theme: Theme): void {
        document.documentElement.setAttribute('data-theme', theme)
    }

    private applyFontSize(size: FontSize): void {
        document.documentElement.style.fontSize = FONT_SIZES[size]
    }

    private loadTheme(): Theme {
        const saved = localStorage.getItem('fleet-theme')
        return saved === 'light' ? 'light' : 'dark'
    }

    private loadFontSize(): FontSize {
        const saved = localStorage.getItem('fleet-font-size')
        if (saved === 'sm' || saved === 'md' || saved === 'lg') return saved
        return 'md'
    }
}
