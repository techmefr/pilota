<script setup lang="ts">
import { ref } from 'vue'
import { sdk } from '../utils/sdk'
import type { LomkitGetResult } from '@pilota/driver-lomkit'
import type { NhostQueryResult } from '@pilota/driver-nhost'

type Status = 'idle' | 'loading' | 'success' | 'error'

const lomkitStatus = ref<Status>('idle')
const lomkitResponse = ref<unknown>(null)
const lomkitError = ref<unknown>(null)

const nhostStatus = ref<Status>('idle')
const nhostResponse = ref<unknown>(null)
const nhostError = ref<unknown>(null)

async function getLomkit(): Promise<void> {
    lomkitStatus.value = 'loading'
    lomkitError.value = null
    try {
        const result = await sdk.lomkit.users.get({ id: 1 }) as Promise<LomkitGetResult<unknown>>
        lomkitResponse.value = await result
        lomkitStatus.value = 'success'
    } catch (e) {
        lomkitError.value = e
        lomkitStatus.value = 'error'
    }
}

async function queryNhost(): Promise<void> {
    nhostStatus.value = 'loading'
    nhostError.value = null
    try {
        const result = await sdk.nhost.users.query({}) as Promise<NhostQueryResult<unknown>>
        nhostResponse.value = await result
        nhostStatus.value = 'success'
    } catch (e) {
        nhostError.value = e
        nhostStatus.value = 'error'
    }
}
</script>

<template>
    <div>
        <h2 class="text-h5 mb-1">POC 1 — Driver + chainage</h2>
        <p class="text-medium-emphasis mb-4">
            Deux drivers coexistent. Le chainage <code>sdk.[driver].[resource].[method]</code> est typé.
        </p>

        <v-row>
            <v-col cols="12" md="6">
                <v-btn
                    color="primary"
                    variant="outlined"
                    :loading="lomkitStatus === 'loading'"
                    @click="getLomkit"
                >
                    sdk.lomkit.users.get()
                </v-btn>
                <PocResult
                    title="LomkitDriver — REST"
                    :status="lomkitStatus"
                    :response="lomkitResponse"
                    :error="lomkitError"
                />
            </v-col>

            <v-col cols="12" md="6">
                <v-btn
                    color="secondary"
                    variant="outlined"
                    :loading="nhostStatus === 'loading'"
                    @click="queryNhost"
                >
                    sdk.nhost.users.query()
                </v-btn>
                <PocResult
                    title="NhostDriver — GraphQL"
                    :status="nhostStatus"
                    :response="nhostResponse"
                    :error="nhostError"
                />
            </v-col>
        </v-row>
    </div>
</template>
