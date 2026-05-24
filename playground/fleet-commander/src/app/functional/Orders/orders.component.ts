import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Subscription } from 'rxjs'
import { SdkService } from '../../technical/Sdk/sdk.service'
import { TranslatePipe } from '../../technical/I18n/translate.pipe'
import type { Order } from '../../technical/Sdk/resources'

@Component({
    selector: 'fc-orders',
    standalone: true,
    imports: [FormsModule, TranslatePipe],
    styles: [`
        .page { padding: 2rem; overflow-y: auto; height: 100%; }
        .page-header { margin-bottom: 1.75rem; }
        .page-title { font-size: 1.35rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.25rem; }
        .page-sub { font-size: 0.8rem; color: var(--text-2); }

        .filters {
            display: flex; align-items: center; gap: 0.75rem;
            margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .fc-input {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 7px; color: var(--text); padding: 0.45rem 0.8rem;
            font-size: 0.82rem; outline: none; transition: border-color 0.15s; min-width: 220px;
        }
        .fc-input:focus { border-color: var(--accent); }
        .fc-input::placeholder { color: var(--text-3); }
        .fc-select {
            background: var(--surface); border: 1px solid var(--border);
            border-radius: 7px; color: var(--text); padding: 0.45rem 0.8rem;
            font-size: 0.82rem; outline: none; cursor: pointer;
        }
        .fc-select option { background: var(--surface); color: var(--text); }

        .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 10px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        th {
            background: var(--surface); color: var(--text-3);
            font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em;
            text-transform: uppercase; padding: 0.6rem 1rem;
            text-align: left; border-bottom: 1px solid var(--border); white-space: nowrap;
        }
        td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); color: var(--text); }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:hover td { background: var(--card-hi); }
        .mono { font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 0.75rem; color: var(--text-2); }

        .badge {
            display: inline-flex; font-size: 0.62rem; font-weight: 700;
            letter-spacing: 0.04em; text-transform: uppercase;
            padding: 0.18rem 0.5rem; border-radius: 4px; white-space: nowrap;
        }
        .badge-pending   { background: var(--warn-bg);   color: var(--warn);      border: 1px solid var(--warn-brd); }
        .badge-approved  { background: var(--accent-bg); color: var(--accent);    border: 1px solid var(--accent-brd); }
        .badge-ordered   { background: var(--accent-bg); color: var(--accent);    border: 1px solid var(--accent-brd); }
        .badge-delivered { background: var(--green-bg);  color: var(--accent-2);  border: 1px solid var(--green-brd); }

        .type-badge {
            display: inline-flex; font-size: 0.6rem; font-weight: 600;
            padding: 0.15rem 0.45rem; border-radius: 4px; white-space: nowrap;
            background: var(--surface); color: var(--text-3); border: 1px solid var(--border);
        }

        .empty { text-align: center; padding: 3rem 1rem; color: var(--text-3); font-size: 0.85rem; }
    `],
    template: `
        <div class="page">
            <div class="page-header">
                <h1 class="page-title">{{ 'orders_title' | translate }}</h1>
                <p class="page-sub">{{ 'orders_sub' | translate }}</p>
            </div>

            <div class="filters">
                <input
                    class="fc-input"
                    type="text"
                    [placeholder]="'search' | translate"
                    [(ngModel)]="searchQuery"
                />
                <select class="fc-select" [(ngModel)]="selectedType">
                    <option value="">{{ 'all_types' | translate }}</option>
                    <option value="hardware">{{ 'order_type_hardware' | translate }}</option>
                    <option value="parts">{{ 'order_type_parts' | translate }}</option>
                    <option value="consumable">{{ 'order_type_consumable' | translate }}</option>
                </select>
                <select class="fc-select" [(ngModel)]="selectedStatus">
                    <option value="">{{ 'all_statuses' | translate }}</option>
                    <option value="pending">{{ 'status_pending' | translate }}</option>
                    <option value="approved">{{ 'status_approved' | translate }}</option>
                    <option value="ordered">{{ 'status_ordered' | translate }}</option>
                    <option value="delivered">{{ 'status_delivered' | translate }}</option>
                </select>
            </div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>{{ 'col_ref' | translate }}</th>
                            <th>{{ 'col_item' | translate }}</th>
                            <th>{{ 'col_type' | translate }}</th>
                            <th>{{ 'col_qty' | translate }}</th>
                            <th>{{ 'col_requested' | translate }}</th>
                            <th>{{ 'col_reason' | translate }}</th>
                            <th>{{ 'col_status' | translate }}</th>
                            <th>{{ 'col_created' | translate }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (o of filteredOrders(); track o.id) {
                            <tr>
                                <td class="mono">{{ o.ref }}</td>
                                <td>{{ o.item }}</td>
                                <td>
                                    <span class="type-badge">
                                        @switch (o.type) {
                                            @case ('hardware')   { {{ 'order_type_hardware' | translate }} }
                                            @case ('parts')      { {{ 'order_type_parts' | translate }} }
                                            @case ('consumable') { {{ 'order_type_consumable' | translate }} }
                                        }
                                    </span>
                                </td>
                                <td>{{ o.quantity }}</td>
                                <td>{{ o.requested_by }}</td>
                                <td style="max-width:200px; font-size:0.78rem; color:var(--text-2)">{{ o.reason }}</td>
                                <td>
                                    <span class="badge" [class]="'badge-' + o.status">
                                        @switch (o.status) {
                                            @case ('pending')   { {{ 'status_pending' | translate }} }
                                            @case ('approved')  { {{ 'status_approved' | translate }} }
                                            @case ('ordered')   { {{ 'status_ordered' | translate }} }
                                            @case ('delivered') { {{ 'status_delivered' | translate }} }
                                        }
                                    </span>
                                </td>
                                <td class="mono">{{ o.created_date }}</td>
                            </tr>
                        } @empty {
                            <tr>
                                <td colspan="8" class="empty">{{ 'no_results' | translate }}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `,
})
export class OrdersComponent implements OnInit, OnDestroy {
    private readonly sdk = inject(SdkService)

    readonly orders = signal<Order[]>([])

    searchQuery = ''
    selectedType = ''
    selectedStatus = ''

    readonly filteredOrders = computed(() => {
        const query = this.searchQuery.toLowerCase()
        const type = this.selectedType
        const status = this.selectedStatus

        return this.orders().filter(o => {
            const matchesQuery =
                !query ||
                o.ref.toLowerCase().includes(query) ||
                o.item.toLowerCase().includes(query) ||
                o.requested_by.toLowerCase().includes(query)

            const matchesType = !type || o.type === type
            const matchesStatus = !status || o.status === status

            return matchesQuery && matchesType && matchesStatus
        })
    })

    private sub: Subscription | null = null

    ngOnInit(): void {
        this.sub = this.sdk.orders$().subscribe(data => this.orders.set(data))
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe()
    }
}
