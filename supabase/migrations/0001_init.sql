-- Kookibooks core schema: profiles, orders, and saved addresses.
-- Run this against your Supabase project (SQL Editor, or `supabase db push`).

-- Automatically mirrors auth.users into a public profile row.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- One row per checkout attempt. Created "pending_payment" before the
-- Stripe redirect, then updated by the webhook.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'fulfilling', 'fulfilled', 'failed', 'cancelled')),
  items jsonb not null, -- CartItem[] snapshot at checkout time
  subtotal_p integer not null,
  shipping_p integer not null,
  total_p integer not null,
  currency text not null default 'gbp',
  customer_email text,
  shipping_address jsonb,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  gelato_order_ids jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Writes to orders happen server-side with the service role key, which
-- bypasses RLS, so no insert/update policy is granted to end users here.

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Home',
  recipient_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  post_code text not null,
  country text not null default 'GB',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

create policy "Users can manage their own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists addresses_user_id_idx on public.addresses (user_id);
