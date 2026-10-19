-- Review: satu per user per game
create table public.reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id bigint not null references public.games(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text check (char_length(body) <= 2000),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, game_id)
);
create index reviews_game_id_idx on public.reviews (game_id);

-- Backlog: satu status per user per game
create table public.game_logs (
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id bigint not null references public.games(id) on delete cascade,
  status text not null check (status in ('wishlist', 'playing', 'finished')),
  updated_at timestamptz default now(),
  primary key (user_id, game_id)
);
create index game_logs_game_id_idx on public.game_logs (game_id);

alter table public.reviews enable row level security;
alter table public.game_logs enable row level security;

-- Review: semua orang boleh baca, hanya pemilik yang boleh menulis
create policy "review dibaca publik" on public.reviews
  for select using (true);
create policy "tulis review sendiri" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "ubah review sendiri" on public.reviews
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "hapus review sendiri" on public.reviews
  for delete using (auth.uid() = user_id);

-- Backlog: pola yang sama
create policy "backlog dibaca publik" on public.game_logs
  for select using (true);
create policy "tulis backlog sendiri" on public.game_logs
  for insert with check (auth.uid() = user_id);
create policy "ubah backlog sendiri" on public.game_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "hapus backlog sendiri" on public.game_logs
  for delete using (auth.uid() = user_id);

-- Rata-rata rating dihitung lewat view (tanpa trigger)
create view public.game_stats with (security_invoker = true) as
select
  game_id,
  round(avg(rating)::numeric, 2) as avg_rating,
  count(*)::int as rating_count
from public.reviews
group by game_id;