<script setup lang="ts">
import { ref } from 'vue'
import { sdk, userResource } from '../utils/sdk'

type Status = 'idle' | 'loading' | 'success' | 'error'

const schemaShape = Object.keys(userResource.schema.shape)
const fragmentKeys = Object.keys(userResource.fragments)
const fragments = userResource.fragments

const queryStatus = ref<Status>('idle')
const queryResponse = ref<unknown>(null)
const queryError = ref<unknown>(null)
const activeFragment = ref<'default' | 'withPosts'>('default')

const mockStatus = ref<Status>('idle')
const mockError = ref<unknown>(null)

async function queryWithFragment(): Promise<void> {
    queryStatus.value = 'loading'
    queryError.value = null
    try {
        const result = await sdk.nhost.users.query(
            {},
            undefined,
            { fragment: activeFragment.value },
        ) as unknown
        queryResponse.value = result
        queryStatus.value = 'success'
    } catch (e) {
        queryError.value = e
        queryStatus.value = 'error'
    }
}

function testInvalidMock(): void {
    mockStatus.value = 'error'
    try {
        userResource.schema.parse({ id: 'not-valid', name: 123, email: 'not-an-email' })
    } catch (e) {
        mockError.value = e
    }
}
</script>

<template>
    <div data-test-id="page-poc-2">
        <h2 class="text-h5 mb-1">POC 2 — Resource + schema + fragments</h2>
        <p class="text-medium-emphasis mb-4">
            <code>defineResource</code> porte le schema Zod et les fragments GraphQL.
        </p>

        <v-row>
            <v-col cols="12" md="6">
                <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-body-1">Schema UserResource</v-card-title>
                    <v-card-text>
                        <v-chip
                            v-for="field in schemaShape"
                            :key="field"
                            :data-test-class="'schema-field'"
                            :data-test-id="`schema-field-${field}`"
                            size="small"
                            class="mr-1 mb-1"
                        >{{ field }}</v-chip>
                    </v-card-text>
                </v-card>

                <v-card variant="outlined">
                    <v-card-title class="text-body-1">Fragments</v-card-title>
                    <v-card-text>
                        <div v-for="key in fragmentKeys" :key="key" class="mb-2">
                            <span class="font-weight-bold text-primary">{{ key }}</span>
                            <div class="text-caption text-medium-emphasis">
                                {{ fragments[key]?.join(' ') }}
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <div class="d-flex align-center gap-2 mb-3">
                    <v-btn-toggle
                        v-model="activeFragment"
                        data-test-id="fragment-toggle"
                        mandatory
                        density="compact"
                    >
                        <v-btn value="default" size="small" data-test-id="btn-fragment-default">default</v-btn>
                        <v-btn value="withPosts" size="small" data-test-id="btn-fragment-withposts">withPosts</v-btn>
                    </v-btn-toggle>
                    <v-btn
                        data-test-id="btn-query"
                        size="small"
                        color="primary"
                        variant="outlined"
                        :loading="queryStatus === 'loading'"
                        @click="queryWithFragment"
                    >
                        Query
                    </v-btn>
                </div>
                <PocResult
                    data-test-id="result-query"
                    title="Query avec fragment"
                    :status="queryStatus"
                    :response="queryResponse"
                    :error="queryError"
                />

                <v-btn
                    data-test-id="btn-invalid-mock"
                    color="error"
                    variant="outlined"
                    size="small"
                    class="mt-4"
                    @click="testInvalidMock"
                >
                    Tester payload invalide
                </v-btn>
                <PocResult
                    v-if="mockStatus !== 'idle'"
                    data-test-id="result-mock-invalid"
                    title="Validation Zod"
                    :status="mockStatus"
                    :error="mockError"
                />
            </v-col>
        </v-row>
    </div>
</template>
