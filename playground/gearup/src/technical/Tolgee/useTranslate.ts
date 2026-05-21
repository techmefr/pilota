import { useState, useEffect } from 'react'
import { tolgee, type Lang } from './index'
import type { Translations } from '../I18n'

export function useTranslate(): Translations {
    const [, rerender] = useState(0)

    useEffect(() => {
        const sub = tolgee.on('language', () => rerender(n => n + 1))
        const subCache = tolgee.on('cache', () => rerender(n => n + 1))
        return () => { sub.unsubscribe(); subCache.unsubscribe() }
    }, [])

    return new Proxy({} as Translations, {
        get: (_target, key: string) => tolgee.t(key),
    }) as Translations
}

export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
    const [lang, setLangState] = useState<Lang>((tolgee.getLanguage() ?? 'fr') as Lang)

    useEffect(() => {
        const sub = tolgee.on('language', () => {
            setLangState((tolgee.getLanguage() ?? 'fr') as Lang)
        })
        return () => sub.unsubscribe()
    }, [])

    return {
        lang,
        setLang: (l: Lang) => tolgee.changeLanguage(l),
    }
}
