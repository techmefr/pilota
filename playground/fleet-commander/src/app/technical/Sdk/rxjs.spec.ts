import { describe, it, expect } from 'vitest'
import { firstValueFrom } from 'rxjs'
import { fromLomkit } from './rxjs'

describe('fromLomkit', () => {
    it('émet les données quand data est un tableau', async () => {
        const items = [{ id: 1 }, { id: 2 }]
        const result = await firstValueFrom(fromLomkit(Promise.resolve({ data: items })))
        expect(result).toEqual(items)
    })

    it('émet un tableau vide quand data est null', async () => {
        const result = await firstValueFrom(fromLomkit(Promise.resolve({ data: null })))
        expect(result).toEqual([])
    })

    it('propage les erreurs de la Promise', async () => {
        const error = new Error('API error')
        await expect(firstValueFrom(fromLomkit(Promise.reject(error)))).rejects.toThrow('API error')
    })

    it('se complète après le premier emit', async () => {
        const emits: unknown[][] = []
        await new Promise<void>(resolve => {
            fromLomkit(Promise.resolve({ data: [1, 2, 3] })).subscribe({
                next: v => emits.push(v),
                complete: () => resolve(),
            })
        })
        expect(emits).toHaveLength(1)
        expect(emits[0]).toEqual([1, 2, 3])
    })
})
