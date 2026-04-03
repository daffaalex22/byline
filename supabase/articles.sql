create extension if not exists pgcrypto;

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body jsonb not null default '[]'::jsonb,
  section text not null,
  category text not null,
  image_url text not null,
  image_alt text not null,
  author text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'scheduled')),
  published_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_status_idx on public.articles (status);

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles"
on public.articles
for select
using (status = 'published');
