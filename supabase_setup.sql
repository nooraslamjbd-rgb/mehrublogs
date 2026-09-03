-- ============================================================
-- Mehrublogs.com Supabase setup
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run
-- ============================================================

-- 1) Contact messages table
create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  service text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

-- 2) Newsletter subscribers table (unique email)
create table if not exists public.newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- 3) Allow anonymous INSERT (needed for the anon/publishable key used
--    by the Vercel serverless functions) but NO read/update/delete.
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anon insert contact" on public.contact_messages;
create policy "anon insert contact"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anon insert newsletter" on public.newsletter_subscribers;
create policy "anon insert newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

-- (optional, recommended) let you read your own messages in the dashboard
-- via the authenticated role. The service_role / dashboard table editor
-- bypasses RLS anyway, so you can also just read rows in the Table Editor.
