-- SenTrajet database schema (Supabase / Postgres)
-- Run this in the Supabase SQL editor, or via `supabase db push`.

-- ─────────────────────────────────────────────────────────────
-- Extensions
-- ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- Profiles (1:1 with auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text unique,
  avatar_url text,
  is_verified boolean not null default false,
  rating_avg numeric(2, 1) not null default 0,
  rating_count integer not null default 0,
  trips_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Utilisateur'),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Regions (the 14 régions du Sénégal — used for city/region pickers)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.regions (
  id smallint primary key,
  name text not null unique
);

insert into public.regions (id, name) values
  (1, 'Dakar'), (2, 'Thiès'), (3, 'Diourbel'), (4, 'Fatick'),
  (5, 'Kaolack'), (6, 'Kaffrine'), (7, 'Kédougou'), (8, 'Kolda'),
  (9, 'Louga'), (10, 'Matam'), (11, 'Saint-Louis'), (12, 'Sédhiou'),
  (13, 'Tambacounda'), (14, 'Ziguinchor')
on conflict (id) do nothing;

alter table public.regions enable row level security;

create policy "Regions are viewable by everyone"
  on public.regions for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- Trajets (rides published by drivers)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.trajets (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles (id) on delete cascade,
  from_city text not null,
  to_city text not null,
  departure_at timestamptz not null,
  price_per_seat integer not null check (price_per_seat >= 0),
  seats_total smallint not null check (seats_total > 0),
  seats_available smallint not null check (seats_available >= 0),
  vehicle text,
  notes text,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists trajets_search_idx
  on public.trajets (from_city, to_city, departure_at)
  where status = 'active';

alter table public.trajets enable row level security;

create policy "Active trajets are viewable by everyone"
  on public.trajets for select
  using (true);

create policy "Drivers can create their own trajets"
  on public.trajets for insert
  with check (auth.uid() = driver_id);

create policy "Drivers can update their own trajets"
  on public.trajets for update
  using (auth.uid() = driver_id);

create policy "Drivers can delete their own trajets"
  on public.trajets for delete
  using (auth.uid() = driver_id);

-- ─────────────────────────────────────────────────────────────
-- Bookings (a passenger reserving seats on a trajet)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  trajet_id uuid not null references public.trajets (id) on delete cascade,
  passenger_id uuid not null references public.profiles (id) on delete cascade,
  seats smallint not null check (seats > 0),
  amount_total integer not null check (amount_total >= 0),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'confirmed', 'cancelled', 'refunded')),
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Passengers can view their own bookings"
  on public.bookings for select
  using (auth.uid() = passenger_id or auth.uid() in (
    select driver_id from public.trajets where id = trajet_id
  ));

create policy "Passengers can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = passenger_id);

create policy "Passengers can update their own pending bookings"
  on public.bookings for update
  using (auth.uid() = passenger_id);

-- ─────────────────────────────────────────────────────────────
-- Payments (PayTech / CinetPay transactions tied to a booking)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  provider text not null default 'paytech' check (provider in ('paytech', 'cinetpay')),
  provider_ref text not null unique,
  amount integer not null check (amount >= 0),
  currency text not null default 'XOF',
  status text not null default 'pending'
    check (status in ('pending', 'success', 'failed', 'cancelled')),
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create policy "Passengers can view payments for their bookings"
  on public.payments for select
  using (auth.uid() in (
    select passenger_id from public.bookings where id = booking_id
  ));

-- Payments are written server-side only (service role via the API routes),
-- so no insert/update policy is granted to regular users.
