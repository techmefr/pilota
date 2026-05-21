'use client'

import { TolgeeProvider, useTolgeeSSR } from '@tolgee/react'
import { tolgee } from './index'

export default function TolgeeClientProvider({ children, lang }: { children: React.ReactNode; lang: string }) {
    const ssrTolgee = useTolgeeSSR(tolgee, lang)

    return (
        <TolgeeProvider tolgee={ssrTolgee} fallback={null}>
            {children}
        </TolgeeProvider>
    )
}
