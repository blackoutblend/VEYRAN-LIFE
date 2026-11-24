-- VEYRAN LIFE — Database Schema & Row-Level Security
create extension if not exists "pgcrypto";

-- 1. Profiles (Admin & Editor accounts)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor', 'contributor')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 2. Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text,
  created_at timestamptz not null default now()
);

-- 3. Tags
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null
);

-- 4. Media Library
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  storage_path text,
  category text not null default 'Travel',
  collection text,
  featured_person text,
  location text,
  caption text,
  tags text[] default '{}',
  status text not null default 'published' check (status in ('published', 'draft')),
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Magazine Issues
create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  volume text not null,
  issue_number text not null,
  title text not null,
  subtitle text,
  category text not null default 'Specials',
  cover_media_id uuid references public.media(id) on delete set null,
  cover_url text,
  editors_letter text,
  published_at date,
  status text not null default 'draft' check (status in ('published', 'draft', 'scheduled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  category text not null default 'Travel',
  author_name text not null default 'Editorial Team',
  location text,
  featured_person text,
  cover_media_id uuid references public.media(id) on delete set null,
  excerpt text,
  body text not null,
  tags text[] default '{}',
  archive_note text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('published', 'draft', 'scheduled')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Issue Articles Junction (ordered)
create table if not exists public.issue_articles (
  issue_id uuid references public.issues(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  position integer not null default 0,
  primary key (issue_id, article_id)
);

-- 8. Featured Content Slots
create table if not exists public.featured_content (
  id uuid primary key default gen_random_uuid(),
  slot text unique not null,
  article_id uuid references public.articles(id) on delete set null,
  issue_id uuid references public.issues(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- 9. Scheduled Posts
create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('article', 'issue', 'media')),
  target_id uuid not null,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'published', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Helper function for admin/editor check
create or replace function public.is_editorial_staff()
returns boolean language sql security definer as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- Enable Row-Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.media enable row level security;
alter table public.issues enable row level security;
alter table public.articles enable row level security;
alter table public.issue_articles enable row level security;
alter table public.featured_content enable row level security;
alter table public.scheduled_posts enable row level security;

-- Public Read Policies (only published content)
create policy "Public read published media" on public.media for select using (status = 'published' or public.is_editorial_staff());
create policy "Public read published issues" on public.issues for select using (status = 'published' or public.is_editorial_staff());
create policy "Public read published articles" on public.articles for select using (status = 'published' or public.is_editorial_staff());
create policy "Public read issue_articles" on public.issue_articles for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read tags" on public.tags for select using (true);
create policy "Public read featured_content" on public.featured_content for select using (true);

-- Editorial Staff Write Policies
create policy "Staff manage media" on public.media for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Staff manage issues" on public.issues for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Staff manage articles" on public.articles for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Staff manage issue_articles" on public.issue_articles for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Staff manage categories" on public.categories for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Staff manage tags" on public.tags for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Staff manage featured_content" on public.featured_content for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Staff manage scheduled_posts" on public.scheduled_posts for all using (public.is_editorial_staff()) with check (public.is_editorial_staff());
create policy "Users view own profile" on public.profiles for select using (auth.uid() = id or public.is_editorial_staff());

-- Storage Bucket for Editorial Media
insert into storage.buckets (id, name, public)
values ('veyran-media', 'veyran-media', true)
on conflict (id) do nothing;

create policy "Public view veyran-media" on storage.objects
  for select using (bucket_id = 'veyran-media');

create policy "Editorial staff upload veyran-media" on storage.objects
  for insert with check (bucket_id = 'veyran-media' and public.is_editorial_staff());

create policy "Editorial staff update veyran-media" on storage.objects
  for update using (bucket_id = 'veyran-media' and public.is_editorial_staff());

create policy "Editorial staff delete veyran-media" on storage.objects
  for delete using (bucket_id = 'veyran-media' and public.is_editorial_staff());

-- Seed Default Categories
insert into public.categories (name, slug, description) values
  ('Travel', 'travel', 'Beaches, islands, resorts, coastal towns and guides.'),
  ('Lifestyle', 'lifestyle', 'Fashion, resort wear, design and coastal living.'),
  ('Culture', 'culture', 'Music, cafés, nightlife, festivals and Veyran arts.'),
  ('People', 'people', 'Interviews, profiles and photo editorials.'),
  ('Feature', 'feature', 'Long-form essays and special dispatches.')
on conflict (slug) do nothing;
