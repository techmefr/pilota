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

create role public nologin;
grant usage on schema public to public;
grant select, insert, update, delete on all tables in schema public to public;
alter default privileges in schema public grant select, insert, update, delete on tables to public;

insert into users (name, email) values
    ('Alice Martin', 'alice@pilota.dev'),
    ('Bob Dupont', 'bob@pilota.dev'),
    ('Carol Simon', 'carol@pilota.dev');
