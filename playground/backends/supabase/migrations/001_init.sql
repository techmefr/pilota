create role anon nologin;

create table users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text unique not null,
    created_at timestamptz not null default now()
);

create table messages (
    id uuid primary key default gen_random_uuid(),
    room_id text not null,
    content text not null,
    author text not null,
    created_at timestamptz not null default now()
);

alter publication supabase_realtime add table messages;

alter table messages disable row level security;
alter table users disable row level security;

grant usage on schema public to anon;
grant select, insert, update, delete on all tables in schema public to anon;
