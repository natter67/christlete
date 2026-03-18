create table if not exists public.journal_entries (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  devotional_id  uuid references public.devotionals(id) on delete set null,
  body           text not null,
  created_at     timestamptz default now() not null
);

alter table public.journal_entries enable row level security;

drop policy if exists "Users manage their own journal entries" on public.journal_entries;
create policy "Users manage their own journal entries"
  on public.journal_entries for all
  using (auth.uid() = user_id);

create table if not exists public.subscriptions (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text default 'free' check (plan in ('free', 'elite')),
  status                 text default 'active',
  current_period_end     timestamptz,
  created_at             timestamptz default now() not null,
  updated_at             timestamptz default now() not null
);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can read their own subscription" on public.subscriptions;
create policy "Users can read their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

insert into public.prayer_groups (name, type, description, sport, is_private, invite_code)
values
  ('FCA Athletes', 'school', 'Fellowship of Christian Athletes open group. All sports, all schools welcome.', null, false, 'FCA001'),
  ('Pregame Chapel', 'event', 'A prayer space for any athlete before any competition. Open always.', null, false, 'CHAPEL'),
  ('Track and Cross Country Faith', 'team', 'For distance and track athletes who run for more than just a finish line.', 'Track', false, 'TRACK1')
on conflict do nothing;
