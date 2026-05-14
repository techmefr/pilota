create extension if not exists "pgcrypto";

create table users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users(id) on delete cascade,
    title text not null,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table messages (
    id uuid primary key default gen_random_uuid(),
    room_id text not null,
    content text not null,
    author text not null,
    created_at timestamptz not null default now()
);

create table products (
    id serial primary key,
    name text not null,
    description text not null default '',
    price numeric(10,2) not null,
    image text not null default '',
    category text not null,
    stock integer not null default 0,
    created_at timestamptz not null default now()
);

grant usage on schema public to public;
grant select, insert, update, delete on all tables in schema public to public;
alter default privileges in schema public grant select, insert, update, delete on tables to public;

insert into users (name, email) values
    ('Alice Martin', 'alice@pilota.dev'),
    ('Bob Dupont', 'bob@pilota.dev'),
    ('Carol Simon', 'carol@pilota.dev');

insert into products (name, description, price, image, category, stock) values
    ('MacBook Pro M3', 'Laptop haut de gamme Apple avec puce M3', 2499.00, 'https://images.unsplash.com/photo-1517336714731-489689fd142f?w=600&h=420&fit=crop&auto=format&q=80', 'Informatique', 5),
    ('iPhone 15 Pro', 'Smartphone Apple en titane', 1199.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=420&fit=crop&auto=format&q=80', 'Smartphones', 12),
    ('AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit active', 279.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=420&fit=crop&auto=format&q=80', 'Audio', 20),
    ('iPad Air M2', 'Tablette polyvalente Apple', 799.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=420&fit=crop&auto=format&q=80', 'Tablettes', 8),
    ('Sony WH-1000XM5', 'Casque audio premium avec ANC', 350.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=420&fit=crop&auto=format&q=80', 'Audio', 15),
    ('Samsung 4K OLED', 'Téléviseur OLED 55 pouces', 1599.00, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&h=420&fit=crop&auto=format&q=80', 'TV', 3),
    ('Logitech MX Master 3', 'Souris ergonomique sans fil', 99.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=420&fit=crop&auto=format&q=80', 'Informatique', 25),
    ('Dell 27" 4K', 'Moniteur 4K USB-C 27 pouces', 599.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=420&fit=crop&auto=format&q=80', 'Informatique', 7);
