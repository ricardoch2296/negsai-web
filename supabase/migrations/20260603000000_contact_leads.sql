create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  company text,
  email text not null,
  phone text,
  message text not null,
  source text not null default 'web',
  turnstile_verified boolean not null default false
);

create index if not exists contact_leads_created_at_idx
  on public.contact_leads (created_at desc);

alter table public.contact_leads enable row level security;

-- Sin políticas para anon/authenticated: solo service_role inserta vía API.
