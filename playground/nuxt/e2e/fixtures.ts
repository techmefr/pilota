export const MOCK_PRODUCTS = [
    { id: 1, name: 'MacBook Pro M3', description: 'Laptop haut de gamme Apple', price: 2499, image: '', category: 'Informatique', stock: 5 },
    { id: 2, name: 'iPhone 15 Pro', description: 'Smartphone Apple titanium', price: 1199, image: '', category: 'Smartphones', stock: 12 },
    { id: 3, name: 'AirPods Pro 2', description: 'Écouteurs sans fil ANC', price: 279, image: '', category: 'Audio', stock: 20 },
    { id: 4, name: 'iPad Air M2', description: 'Tablette polyvalente', price: 799, image: '', category: 'Tablettes', stock: 8 },
    { id: 5, name: 'Sony WH-1000XM5', description: 'Casque audio premium', price: 350, image: '', category: 'Audio', stock: 15 },
    { id: 6, name: 'Samsung 4K OLED', description: 'Téléviseur 55 pouces', price: 1599, image: '', category: 'TV', stock: 3 },
]

export const MOCK_CART_ITEMS = [
    { id: 1, product_id: 1, product_name: 'MacBook Pro M3', unit_price: 2499, quantity: 1 },
    { id: 2, product_id: 3, product_name: 'AirPods Pro 2', unit_price: 279, quantity: 2 },
]

export const NHOST_GRAPHQL_URL = '**/v1/graphql'
export const LOMKIT_SEARCH_URL = '**/api/cartItems/search'
export const LOMKIT_MUTATE_URL = '**/api/cartItems/mutate'
export const LOMKIT_DELETE_URL = '**/api/cartItems'
