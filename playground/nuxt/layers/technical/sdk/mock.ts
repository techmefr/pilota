import type { Product } from './resources'

export const mockProducts: Product[] = [
    { id: 1, name: 'MacBook Pro M3', description: 'Laptop haut de gamme Apple avec puce M3 — performances exceptionnelles pour les professionnels.', price: 2499, image: 'https://images.unsplash.com/photo-1517336714731-489689fd142f?w=600&h=420&fit=crop&auto=format&q=80', category: 'Informatique', stock: 5 },
    { id: 2, name: 'iPhone 15 Pro', description: 'Smartphone Apple en titane avec puce A17 Pro et système de caméra pro.', price: 1199, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=420&fit=crop&auto=format&q=80', category: 'Smartphones', stock: 12 },
    { id: 3, name: 'AirPods Pro 2', description: 'Écouteurs sans fil avec réduction de bruit active de nouvelle génération.', price: 279, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=420&fit=crop&auto=format&q=80', category: 'Audio', stock: 20 },
    { id: 4, name: 'iPad Air M2', description: 'Tablette polyvalente Apple avec puce M2, parfaite pour la créativité.', price: 799, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=420&fit=crop&auto=format&q=80', category: 'Tablettes', stock: 8 },
    { id: 5, name: 'Sony WH-1000XM5', description: 'Casque audio premium avec la meilleure réduction de bruit du marché.', price: 350, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=420&fit=crop&auto=format&q=80', category: 'Audio', stock: 15 },
    { id: 6, name: 'Samsung 4K OLED', description: 'Téléviseur OLED 55 pouces avec qualité d\'image époustouflante.', price: 1599, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=420&fit=crop&auto=format&q=80', category: 'TV', stock: 3 },
]
