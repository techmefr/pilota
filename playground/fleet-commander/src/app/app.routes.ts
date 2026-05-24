import { Routes } from '@angular/router'
import { LayoutComponent } from './technical/Layout/layout.component'

export const appRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./functional/Fleet/fleet.component').then(m => m.FleetComponent),
            },
            {
                path: 'inventory',
                loadComponent: () =>
                    import('./functional/Inventory/inventory.component').then(m => m.InventoryComponent),
            },
            {
                path: 'profiles',
                loadComponent: () =>
                    import('./functional/Profiles/profiles.component').then(m => m.ProfilesComponent),
            },
            {
                path: 'repairs',
                loadComponent: () =>
                    import('./functional/Repairs/repairs.component').then(m => m.RepairsComponent),
            },
            {
                path: 'orders',
                loadComponent: () =>
                    import('./functional/Orders/orders.component').then(m => m.OrdersComponent),
            },
            {
                path: 'alerts',
                loadComponent: () =>
                    import('./functional/Alerts/alerts.component').then(m => m.AlertsComponent),
            },
            {
                path: 'pc/:serial',
                loadComponent: () =>
                    import('./functional/PcDetail/pc-detail.component').then(m => m.PcDetailComponent),
            },
        ],
    },
    { path: '**', redirectTo: '' },
]
