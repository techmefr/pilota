'use client'

import { TolgeeProvider } from '@tolgee/react'
import { tolgee } from './index'

export default function TolgeeClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <TolgeeProvider tolgee={tolgee} fallback={null}>
            {children}
        </TolgeeProvider>
    )
}
