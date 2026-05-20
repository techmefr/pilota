import { createPilota } from '@pilota/core'
import { LomkitDriver } from '@pilota/driver-lomkit'
import {
    productResource, projectResource, objectiveResource,
    deliveryResource, missionResource, absenceResource,
    devopsNeedResource, weekInfoResource, revenueResource, contractResource,
} from './resources'

const lomkit = new LomkitDriver({
    baseUrl: process.env.LARAVEL_API_URL ?? 'http://localhost:8000/api',
})

lomkit.bindResource('products', productResource)
lomkit.bindResource('projects', projectResource)
lomkit.bindResource('objectives', objectiveResource)
lomkit.bindResource('deliveries', deliveryResource)
lomkit.bindResource('missions', missionResource)
lomkit.bindResource('absences', absenceResource)
lomkit.bindResource('devops_needs', devopsNeedResource)
lomkit.bindResource('week_info', weekInfoResource)
lomkit.bindResource('revenue', revenueResource)
lomkit.bindResource('contracts', contractResource)

export const sdk = createPilota({ drivers: { lomkit } })

export type {
    Product, Project, Objective, Delivery, Mission,
    Absence, DevOpsNeed, WeekInfo, Revenue, Contract,
} from './resources'
