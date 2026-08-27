create table public.custom_learning_materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  source_text text not null check (char_length(source_text) between 50 and 6000),
  target_level text not null check (target_level in ('auto', 'A1', 'A2', 'B1', 'B2')),
  focus text not null check (focus in ('balanced', 'vocabulary', 'grammar', 'writing')),
  material jsonb not null check (jsonb_typeof(material) = 'object'),
  storage_bytes bigint not null check (storage_bytes > 0),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create index custom_learning_materials_user_created_idx
  on public.custom_learning_materials (user_id, created_at desc);

create table public.practice_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  material_id uuid not null,
  questions jsonb not null check (jsonb_typeof(questions) = 'array'),
  answer_key jsonb not null check (jsonb_typeof(answer_key) = 'array'),
  storage_bytes bigint not null check (storage_bytes > 0),
  created_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (material_id, user_id)
    references public.custom_learning_materials (id, user_id)
    on delete cascade
);

create index practice_sets_user_material_created_idx
  on public.practice_sets (user_id, material_id, created_at desc);

create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  practice_set_id uuid not null,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  results jsonb not null check (jsonb_typeof(results) = 'object'),
  score integer not null check (score between 0 and 100),
  correct_count integer not null check (correct_count >= 0),
  total_count integer not null check (total_count > 0 and correct_count <= total_count),
  storage_bytes bigint not null check (storage_bytes > 0),
  created_at timestamptz not null default now(),
  foreign key (practice_set_id, user_id)
    references public.practice_sets (id, user_id)
    on delete cascade
);

create index practice_attempts_user_set_created_idx
  on public.practice_attempts (user_id, practice_set_id, created_at desc);

alter table public.custom_learning_materials enable row level security;
alter table public.practice_sets enable row level security;
alter table public.practice_attempts enable row level security;

revoke all on table public.custom_learning_materials from anon, authenticated;
revoke all on table public.practice_sets from anon, authenticated;
revoke all on table public.practice_attempts from anon, authenticated;

grant select, insert, update, delete on table public.custom_learning_materials to service_role;
grant select, insert, update, delete on table public.practice_sets to service_role;
grant select, insert, update, delete on table public.practice_attempts to service_role;

comment on table public.custom_learning_materials is
  'Invite-user source texts and immutable generated learning-material snapshots; trusted server access only.';
comment on table public.practice_sets is
  'DeepSeek-generated objective practice snapshots with server-only answer keys.';
comment on table public.practice_attempts is
  'Append-only deterministic grading records for long-term learning history.';
