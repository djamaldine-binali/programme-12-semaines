-- Phones subscribed to the water reminders. Only the Edge Functions (secret key) read or write it.
create table public.push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  timezone text not null,
  hours smallint[] not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

revoke all on public.push_subscriptions from anon, authenticated;
grant select, insert, update, delete on public.push_subscriptions to service_role;
