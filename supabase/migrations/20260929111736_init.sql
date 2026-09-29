create extension if not exists pg_trgm;

-- Profil pengguna
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_]{3,20}$'),
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- Cache data game dari IGDB
create table public.games (
  id bigint generated always as identity primary key,
  rawg_id bigint unique not null,
  slug text unique not null,
  title text not null,
  summary text,
  cover_url text,
  release_date date,
  avg_rating numeric(3,2) default 0,
  rating_count int default 0,
  synced_at timestamptz default now()
);

create index games_title_trgm on public.games using gin (title gin_trgm_ops);

-- Buat profil otomatis saat user mendaftar
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(split_part(new.email, '@', 1)) || floor(random()*900+100)::int);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.games enable row level security;

create policy "profil dibaca publik" on public.profiles for select using (true);
create policy "ubah profil sendiri" on public.profiles for update using (auth.uid() = id);
create policy "game dibaca publik" on public.games for select using (true);
-- Tidak ada policy insert/update di games: hanya service role yang bisa menulis