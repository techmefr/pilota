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

export const sdk = createPilota({
    drivers: { lomkit },
    resources: {
        lomkit: {
            products: productResource,
            projects: projectResource,
            objectives: objectiveResource,
            deliveries: deliveryResource,
            missions: missionResource,
            absences: absenceResource,
            devops_needs: devopsNeedResource,
            week_info: weekInfoResource,
            revenue: revenueResource,
            contracts: contractResource,
        },
    },
})

export type {
    Product, Project, Objective, Delivery, Mission,
    Absence, DevOpsNeed, WeekInfo, Revenue, Contract,
} from './resources'
