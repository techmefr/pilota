import { createPilota } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import { projectResource, productResource, objectiveResource, deliveryResource, missionResource } from './resources'

const lomkit = new LomkitDriver({
    baseUrl: process.env.LARAVEL_API_URL ?? 'http://localhost:8000/api',
})

lomkit.bindResource('products', productResource)
lomkit.bindResource('projects', projectResource)
lomkit.bindResource('objectives', objectiveResource)
lomkit.bindResource('deliveries', deliveryResource)
lomkit.bindResource('missions', missionResource)

export const sdk = createPilota({ drivers: { lomkit } })

export type { Product, Project, Objective, Delivery, Mission } from './resources'
