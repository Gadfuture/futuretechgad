create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  company text,
  coin_balance numeric not null default 1000,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles
add column if not exists coin_balance numeric not null default 1000;

create table if not exists public.user_miners (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null,
  plan_name text not null,
  cost numeric not null,
  daily_yield numeric not null,
  status text not null default 'active' check (status in ('active', 'paused')),
  last_claimed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.withdrawal_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_coins numeric not null check (amount_coins >= 3000),
  usd_value numeric not null,
  network text not null check (network in ('TRX', 'BNB', 'USDT')),
  wallet_address text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.trade_orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  asset text not null check (asset in ('BTC', 'USDT', 'LTC', 'BNB', 'ETH', 'TRX')),
  direction text not null check (direction in ('buy', 'sell')),
  stake numeric not null check (stake >= 10),
  pnl numeric not null default 0,
  status text not null default 'closed' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  project_name text,
  network text,
  wallet_address text,
  description text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.request_messages (
  id uuid primary key default uuid_generate_v4(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  author_role text not null check (author_role in ('client', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, company)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'company'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    company = excluded.company;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.request_messages enable row level security;
alter table public.user_miners enable row level security;
alter table public.withdrawal_requests enable row level security;
alter table public.trade_orders enable row level security;

create policy "profiles own read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles own update" on public.profiles
for update using (auth.uid() = id);

create policy "requests own read" on public.service_requests
for select using (auth.uid() = user_id);

create policy "requests own insert" on public.service_requests
for insert with check (auth.uid() = user_id);

create policy "requests own update" on public.service_requests
for update using (auth.uid() = user_id);

create policy "messages own read" on public.request_messages
for select using (
  exists (
    select 1
    from public.service_requests sr
    where sr.id = request_id and sr.user_id = auth.uid()
  )
);

create policy "messages own insert" on public.request_messages
for insert with check (
  author_role = 'client' and
  exists (
    select 1
    from public.service_requests sr
    where sr.id = request_id and sr.user_id = auth.uid()
  )
);

create policy "miners own read" on public.user_miners
for select using (auth.uid() = user_id);

create policy "miners own insert" on public.user_miners
for insert with check (auth.uid() = user_id);

create policy "miners own update" on public.user_miners
for update using (auth.uid() = user_id);

create policy "withdrawals own read" on public.withdrawal_requests
for select using (auth.uid() = user_id);

create policy "withdrawals own insert" on public.withdrawal_requests
for insert with check (auth.uid() = user_id);

create policy "trades own read" on public.trade_orders
for select using (auth.uid() = user_id);

create policy "trades own insert" on public.trade_orders
for insert with check (auth.uid() = user_id);

create policy "admin full access profiles" on public.profiles
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admin full access requests" on public.service_requests
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admin full access messages" on public.request_messages
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admin full access miners" on public.user_miners
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admin full access withdrawals" on public.withdrawal_requests
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "admin full access trades" on public.trade_orders
for all using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);
