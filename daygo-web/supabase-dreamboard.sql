-- 1. Create the dreamboard_images table
create table dreamboard_images (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  image_url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table dreamboard_images enable row level security;

create policy "Users can view own dreamboard images"
  on dreamboard_images for select using (auth.uid() = user_id);

create policy "Users can insert own dreamboard images"
  on dreamboard_images for insert with check (auth.uid() = user_id);

create policy "Users can update own dreamboard images"
  on dreamboard_images for update using (auth.uid() = user_id);

create policy "Users can delete own dreamboard images"
  on dreamboard_images for delete using (auth.uid() = user_id);

-- 2. Create the storage bucket
insert into storage.buckets (id, name, public) values ('dreamboard', 'dreamboard', true);

create policy "Users can upload dreamboard images"
  on storage.objects for insert with check (
    bucket_id = 'dreamboard' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own dreamboard images"
  on storage.objects for delete using (
    bucket_id = 'dreamboard' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Public dreamboard read access"
  on storage.objects for select using (bucket_id = 'dreamboard');
