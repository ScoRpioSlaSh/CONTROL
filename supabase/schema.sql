-- Control - Inventario + Contabilidad
create extension if not exists "uuid-ossp";

create type public.app_role as enum ('ADMIN', 'OPERADOR', 'LECTURA');
create type public.movement_type as enum ('ENTRADA', 'SALIDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'TRANSFERENCIA');

create table if not exists public.warehouses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role app_role not null default 'LECTURA',
  is_active boolean not null default true,
  default_warehouse_id uuid references public.warehouses(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id int primary key default 1,
  allow_negative_stock boolean not null default false,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  constraint singleton_settings check (id = 1)
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sku text not null unique,
  category text,
  brand text,
  unit text,
  description text,
  image_url text,
  qr_value text not null unique,
  barcode_value text,
  min_stock numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  type movement_type not null,
  warehouse_origin_id uuid references public.warehouses(id),
  warehouse_dest_id uuid references public.warehouses(id),
  product_id uuid not null references public.products(id),
  quantity numeric not null check (quantity > 0),
  cost_unit numeric,
  reason text,
  reference text,
  notes text
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'ADMIN' and p.is_active = true
  );
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.warehouses enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.app_settings enable row level security;

create policy "active users read own profile" on public.profiles
for select using (auth.uid() = id and public.is_active_user());

create policy "admin manage profiles" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

create policy "active users read products" on public.products
for select using (public.is_active_user());
create policy "admin write products" on public.products
for all using (public.is_admin()) with check (public.is_admin());

create policy "operators write movements" on public.inventory_movements
for insert with check (
  public.is_active_user()
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('ADMIN','OPERADOR'))
  and created_by = auth.uid()
);

create policy "active users read movements" on public.inventory_movements
for select using (public.is_active_user());

create policy "active users read warehouses" on public.warehouses
for select using (public.is_active_user());
create policy "admin manage warehouses" on public.warehouses
for all using (public.is_admin()) with check (public.is_admin());

create policy "active users read settings" on public.app_settings
for select using (public.is_active_user());
create policy "admin update settings" on public.app_settings
for update using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, role, is_active)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'LECTURA', true)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
