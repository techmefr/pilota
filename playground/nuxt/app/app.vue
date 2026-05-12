<template>
    <v-app>
        <v-app-bar color="primary" density="compact">
            <v-app-bar-title>
                <NuxtLink to="/" class="text-white text-decoration-none font-weight-bold">
                    Pilota POC
                </NuxtLink>
            </v-app-bar-title>
        </v-app-bar>

        <v-main>
            <v-container class="py-6">
                <NuxtPage />
            </v-container>
        </v-main>
    </v-app>
</template>
