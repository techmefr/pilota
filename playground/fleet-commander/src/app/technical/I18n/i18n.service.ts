import { Injectable, signal, computed } from '@angular/core'

export type Lang = 'fr' | 'en' | 'it'

const fr = {
    nav_fleet:      'Tableau de bord',
    nav_dashboard:  'Tableau de bord',
    nav_profiles:   'Configurateur',
    nav_inventory:  'Inventaire',
    nav_repairs:    'Réparations',
    nav_orders:     'Commandes',
    nav_prevention: 'Prévention',
    nav_alerts:     'Alertes',
    nav_cycle:      'Cycle',

    kpi_devices:    'Appareils',
    kpi_total:      'Appareils en parc',
    kpi_repairs:    'En réparation',
    kpi_orders:     'Commandes en cours',
    kpi_alerts:     'Alertes actives',
    kpi_profiles:   'profils configurés',
    kpi_repairs_sub: 'tickets ouverts',
    kpi_orders_sub:  'en attente ou en cours',
    kpi_alerts_sub:  'critiques ou avertissements',

    recent_activity: 'Activité récente',
    critical_alerts: 'Alertes critiques',

    profiles_title: 'Configurateur',
    profiles_sub:   'Configurations HP recommandées par profil métier · Cycle',
    col_profile:    'Profil',
    col_model:      'Modèle',
    col_specs:      'Spécifications',
    col_screens:    'Écrans',
    col_total:      'Postes',
    col_stock:      'Stock',
    col_to_order:   'À commander',

    inventory_title: 'Inventaire',
    inventory_sub:   'Parc actuel · Qui a quoi par équipe',
    col_employee:    'Employé',
    col_team:        'Équipe',
    col_device:      'Appareil',
    col_serial:      'N° série',
    col_assigned:    'Attribution',
    col_status:      'Statut',

    repairs_title:   'Réparations',
    repairs_sub:     'Tickets ouverts et historique',
    col_ticket:      'Ticket',
    col_issue:       'Problème',
    col_technician:  'Technicien',
    col_opened:      'Ouvert le',
    col_closed:      'Clôturé le',
    new_repair:      'Nouveau ticket',

    orders_title:    'Commandes',
    orders_sub:      'Matériel et pièces · Demandes en cours',
    col_ref:         'Réf.',
    col_item:        'Article',
    col_qty:         'Qté',
    col_reason:      'Motif',
    col_requested:   'Demandé par',
    col_created:     'Date',
    new_order:       'Nouvelle commande',

    prevention_title: 'Prévention',
    prevention_sub:   'Garanties, ancienneté, alertes planifiées',
    col_device_emp:   'Appareil · Employé',
    col_type:         'Type',
    col_due:          'Échéance',
    acknowledge:      'Traité',

    alerts_title:    'Alertes',
    alerts_sub:      'Garanties, ancienneté, alertes planifiées',

    status_active:        'Actif',
    status_repair:        'En réparation',
    status_returned:      'Rendu',
    status_open:          'Ouvert',
    status_in_progress:   'En cours',
    status_waiting_parts: 'Attente pièces',
    status_closed:        'Clôturé',
    status_pending:       'En attente',
    status_approved:      'Approuvé',
    status_ordered:       'Commandé',
    status_delivered:     'Livré',
    status_acknowledged:  'Traité',
    status_resolved:      'Résolu',

    all_teams:    'Toutes les équipes',
    all_statuses: 'Tous les statuts',
    all_types:    'Tous les types',
    search:       'Rechercher…',
    no_results:   'Aucun résultat',

    order_item:      'Article',
    order_type:      'Type',
    order_qty:       'Quantité',
    order_reason:    'Motif',
    order_type_hardware:   'Matériel',
    order_type_parts:      'Pièces',
    order_type_consumable: 'Consommable',

    repair_device:      'Appareil',
    repair_employee:    'Employé',
    repair_issue:       'Description du problème',
    repair_technician:  'Technicien assigné',

    cancel:  'Annuler',
    confirm: 'Confirmer',
    save:    'Enregistrer',
    close:   'Fermer',

    perf:  'Performance',
    std:   'Standard',
    apple: 'Apple',

    hub_link: '← Hub',

    nav_settings:    'Réglages',
    settings_title:  'Réglages',
    settings_sub:    'Apparence et langue',
    settings_appearance: 'Apparence',
    settings_theme:       'Thème',
    settings_theme_dark:  'Sombre',
    settings_theme_light: 'Clair',
    settings_font_size:   'Taille des polices',
    settings_font_sm:     'Petite',
    settings_font_md:     'Moyenne',
    settings_font_lg:     'Grande',
    settings_language:    'Langue',

    pc_detail_title:   'Détail appareil',
    pc_detail_sub:     'Données agrégées depuis 3 drivers',
    assignment_info:   'Affectation',
    hardware_info:     'Configuration matérielle',
    maintenance_info:  'Maintenance',
    driver_lomkit:     'Lomkit / Laravel',
    driver_supabase:   'Supabase Realtime',
    driver_nhost:      'Nhost / GraphQL',
    placeholder_data:  'Données placeholder',

    realtime_feed:   'Flux temps réel',
    no_events:       'En attente d\'événements…',
}

const en: typeof fr = {
    nav_fleet:      'Dashboard',
    nav_dashboard:  'Dashboard',
    nav_profiles:   'Configurator',
    nav_inventory:  'Inventory',
    nav_repairs:    'Repairs',
    nav_orders:     'Orders',
    nav_prevention: 'Prevention',
    nav_alerts:     'Alerts',
    nav_cycle:      'Cycle',

    kpi_devices:    'Devices',
    kpi_total:      'Devices in fleet',
    kpi_repairs:    'Under repair',
    kpi_orders:     'Active orders',
    kpi_alerts:     'Active alerts',
    kpi_profiles:   'configured profiles',
    kpi_repairs_sub: 'open tickets',
    kpi_orders_sub:  'pending or in progress',
    kpi_alerts_sub:  'critical or warnings',

    recent_activity: 'Recent activity',
    critical_alerts: 'Critical alerts',

    profiles_title: 'Configurator',
    profiles_sub:   'Recommended HP configurations by role · Cycle',
    col_profile:    'Profile',
    col_model:      'Model',
    col_specs:      'Specifications',
    col_screens:    'Screens',
    col_total:      'Seats',
    col_stock:      'Stock',
    col_to_order:   'To order',

    inventory_title: 'Inventory',
    inventory_sub:   'Current fleet · Who has what by team',
    col_employee:    'Employee',
    col_team:        'Team',
    col_device:      'Device',
    col_serial:      'Serial no.',
    col_assigned:    'Assigned',
    col_status:      'Status',

    repairs_title:   'Repairs',
    repairs_sub:     'Open tickets and history',
    col_ticket:      'Ticket',
    col_issue:       'Issue',
    col_technician:  'Technician',
    col_opened:      'Opened',
    col_closed:      'Closed',
    new_repair:      'New ticket',

    orders_title:    'Orders',
    orders_sub:      'Hardware and parts · Active requests',
    col_ref:         'Ref.',
    col_item:        'Item',
    col_qty:         'Qty',
    col_reason:      'Reason',
    col_requested:   'Requested by',
    col_created:     'Date',
    new_order:       'New order',

    prevention_title: 'Prevention',
    prevention_sub:   'Warranties, device age, scheduled alerts',
    col_device_emp:   'Device · Employee',
    col_type:         'Type',
    col_due:          'Due date',
    acknowledge:      'Acknowledge',

    alerts_title:    'Alerts',
    alerts_sub:      'Warranties, device age, scheduled alerts',

    status_active:        'Active',
    status_repair:        'Under repair',
    status_returned:      'Returned',
    status_open:          'Open',
    status_in_progress:   'In progress',
    status_waiting_parts: 'Waiting parts',
    status_closed:        'Closed',
    status_pending:       'Pending',
    status_approved:      'Approved',
    status_ordered:       'Ordered',
    status_delivered:     'Delivered',
    status_acknowledged:  'Acknowledged',
    status_resolved:      'Resolved',

    all_teams:    'All teams',
    all_statuses: 'All statuses',
    all_types:    'All types',
    search:       'Search…',
    no_results:   'No results',

    order_item:      'Item',
    order_type:      'Type',
    order_qty:       'Quantity',
    order_reason:    'Reason',
    order_type_hardware:   'Hardware',
    order_type_parts:      'Parts',
    order_type_consumable: 'Consumable',

    repair_device:      'Device',
    repair_employee:    'Employee',
    repair_issue:       'Issue description',
    repair_technician:  'Assigned technician',

    cancel:  'Cancel',
    confirm: 'Confirm',
    save:    'Save',
    close:   'Close',

    perf:  'Performance',
    std:   'Standard',
    apple: 'Apple',

    hub_link: '← Hub',

    nav_settings:    'Settings',
    settings_title:  'Settings',
    settings_sub:    'Appearance & language',
    settings_appearance: 'Appearance',
    settings_theme:       'Theme',
    settings_theme_dark:  'Dark',
    settings_theme_light: 'Light',
    settings_font_size:   'Font size',
    settings_font_sm:     'Small',
    settings_font_md:     'Medium',
    settings_font_lg:     'Large',
    settings_language:    'Language',

    pc_detail_title:   'Device detail',
    pc_detail_sub:     'Aggregated data from 3 drivers',
    assignment_info:   'Assignment',
    hardware_info:     'Hardware configuration',
    maintenance_info:  'Maintenance',
    driver_lomkit:     'Lomkit / Laravel',
    driver_supabase:   'Supabase Realtime',
    driver_nhost:      'Nhost / GraphQL',
    placeholder_data:  'Placeholder data',

    realtime_feed:   'Realtime feed',
    no_events:       'Waiting for events…',
}

const it: typeof fr = {
    nav_fleet:      'Dashboard',
    nav_dashboard:  'Dashboard',
    nav_profiles:   'Configuratore',
    nav_inventory:  'Inventario',
    nav_repairs:    'Riparazioni',
    nav_orders:     'Ordini',
    nav_prevention: 'Prevenzione',
    nav_alerts:     'Avvisi',
    nav_cycle:      'Ciclo',

    kpi_devices:    'Dispositivi',
    kpi_total:      'Dispositivi in flotta',
    kpi_repairs:    'In riparazione',
    kpi_orders:     'Ordini attivi',
    kpi_alerts:     'Avvisi attivi',
    kpi_profiles:   'profili configurati',
    kpi_repairs_sub: 'ticket aperti',
    kpi_orders_sub:  'in attesa o in corso',
    kpi_alerts_sub:  'critici o avvisi',

    recent_activity: 'Attività recente',
    critical_alerts: 'Avvisi critici',

    profiles_title: 'Configuratore',
    profiles_sub:   'Configurazioni HP raccomandate per profilo · Ciclo',
    col_profile:    'Profilo',
    col_model:      'Modello',
    col_specs:      'Specifiche',
    col_screens:    'Schermi',
    col_total:      'Postazioni',
    col_stock:      'Stock',
    col_to_order:   'Da ordinare',

    inventory_title: 'Inventario',
    inventory_sub:   'Flotta attuale · Chi ha cosa per team',
    col_employee:    'Dipendente',
    col_team:        'Team',
    col_device:      'Dispositivo',
    col_serial:      'N° serie',
    col_assigned:    'Assegnato',
    col_status:      'Stato',

    repairs_title:   'Riparazioni',
    repairs_sub:     'Ticket aperti e storico',
    col_ticket:      'Ticket',
    col_issue:       'Problema',
    col_technician:  'Tecnico',
    col_opened:      'Aperto il',
    col_closed:      'Chiuso il',
    new_repair:      'Nuovo ticket',

    orders_title:    'Ordini',
    orders_sub:      'Hardware e componenti · Richieste in corso',
    col_ref:         'Rif.',
    col_item:        'Articolo',
    col_qty:         'Qtà',
    col_reason:      'Motivo',
    col_requested:   'Richiesto da',
    col_created:     'Data',
    new_order:       'Nuovo ordine',

    prevention_title: 'Prevenzione',
    prevention_sub:   'Garanzie, anzianità, avvisi pianificati',
    col_device_emp:   'Dispositivo · Dipendente',
    col_type:         'Tipo',
    col_due:          'Scadenza',
    acknowledge:      'Preso in carico',

    alerts_title:    'Avvisi',
    alerts_sub:      'Garanzie, anzianità, avvisi pianificati',

    status_active:        'Attivo',
    status_repair:        'In riparazione',
    status_returned:      'Restituito',
    status_open:          'Aperto',
    status_in_progress:   'In corso',
    status_waiting_parts: 'Attesa pezzi',
    status_closed:        'Chiuso',
    status_pending:       'In attesa',
    status_approved:      'Approvato',
    status_ordered:       'Ordinato',
    status_delivered:     'Consegnato',
    status_acknowledged:  'Preso in carico',
    status_resolved:      'Risolto',

    all_teams:    'Tutti i team',
    all_statuses: 'Tutti gli stati',
    all_types:    'Tutti i tipi',
    search:       'Cerca…',
    no_results:   'Nessun risultato',

    order_item:      'Articolo',
    order_type:      'Tipo',
    order_qty:       'Quantità',
    order_reason:    'Motivo',
    order_type_hardware:   'Hardware',
    order_type_parts:      'Componenti',
    order_type_consumable: 'Consumabile',

    repair_device:      'Dispositivo',
    repair_employee:    'Dipendente',
    repair_issue:       'Descrizione del problema',
    repair_technician:  'Tecnico assegnato',

    cancel:  'Annulla',
    confirm: 'Conferma',
    save:    'Salva',
    close:   'Chiudi',

    perf:  'Prestazioni',
    std:   'Standard',
    apple: 'Apple',

    hub_link: '← Hub',

    nav_settings:    'Impostazioni',
    settings_title:  'Impostazioni',
    settings_sub:    'Aspetto e lingua',
    settings_appearance: 'Aspetto',
    settings_theme:       'Tema',
    settings_theme_dark:  'Scuro',
    settings_theme_light: 'Chiaro',
    settings_font_size:   'Dimensione carattere',
    settings_font_sm:     'Piccolo',
    settings_font_md:     'Medio',
    settings_font_lg:     'Grande',
    settings_language:    'Lingua',

    pc_detail_title:   'Dettaglio dispositivo',
    pc_detail_sub:     'Dati aggregati da 3 driver',
    assignment_info:   'Assegnazione',
    hardware_info:     'Configurazione hardware',
    maintenance_info:  'Manutenzione',
    driver_lomkit:     'Lomkit / Laravel',
    driver_supabase:   'Supabase Realtime',
    driver_nhost:      'Nhost / GraphQL',
    placeholder_data:  'Dati placeholder',

    realtime_feed:   'Feed in tempo reale',
    no_events:       'In attesa di eventi…',
}

export const translations = { fr, en, it }

export type Translations = typeof fr

export function getTranslations(lang: Lang): Translations {
    return translations[lang]
}

@Injectable({ providedIn: 'root' })
export class I18nService {
    readonly lang = signal<Lang>('fr')
    readonly t = computed(() => getTranslations(this.lang()))

    constructor() {
        const saved = localStorage.getItem('fleet-lang')
        if (saved === 'fr' || saved === 'en' || saved === 'it') {
            this.lang.set(saved)
        }
    }

    setLang(lang: Lang): void {
        this.lang.set(lang)
        localStorage.setItem('fleet-lang', lang)
    }
}
