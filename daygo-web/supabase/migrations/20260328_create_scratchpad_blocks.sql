-- Scratchpad blocks: persists daily planning scratch pad data per user per date
create table if not exists scratchpad_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, date)
);

-- RLS
alter table scratchpad_blocks enable row level security;

create policy "Users can view own scratchpad blocks"
  on scratchpad_blocks for select
  using (auth.uid() = user_id);

create policy "Users can insert own scratchpad blocks"
  on scratchpad_blocks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own scratchpad blocks"
  on scratchpad_blocks for update
  using (auth.uid() = user_id);

create policy "Users can delete own scratchpad blocks"
  on scratchpad_blocks for delete
  using (auth.uid() = user_id);
