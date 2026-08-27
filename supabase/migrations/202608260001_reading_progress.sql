create table public.reading_progress (
  user_id uuid not null,
  reading_slug text not null check (char_length(reading_slug) between 1 and 120),
  draft text not null default '' check (char_length(draft) <= 10000),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, reading_slug)
);

alter table public.reading_progress enable row level security;
revoke all on table public.reading_progress from anon, authenticated;
grant select, insert, update, delete on table public.reading_progress to service_role;

comment on table public.reading_progress is
  'Accessed only by the trusted application server after invite-session authorization. Browser roles have no grants.';
