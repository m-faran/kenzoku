-- =============================================
-- Inner Circle — Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  bio text default '',
  city text default '',
  school text default '',
  photo_url text default '',
  motive text default '',
  specific_interests text default '',
  interests text[] default '{}',
  age int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles readable by authenticated" on profiles
  for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- 2. Connections
create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  unique (sender_id, receiver_id)
);

alter table connections enable row level security;

create policy "Users see own connections" on connections
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send connections" on connections
  for insert with check (auth.uid() = sender_id);
create policy "Receiver can update status" on connections
  for update using (auth.uid() = receiver_id);

-- 3. Notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('connection', 'message', 'discovery', 'shared')),
  text text not null,
  read boolean default false,
  avatar_url text,
  reference_id uuid,
  created_at timestamptz default now()
);

alter table notifications enable row level security;

create policy "Users see own notifications" on notifications
  for select using (auth.uid() = user_id);
create policy "Authenticated can insert" on notifications
  for insert with check (auth.role() = 'authenticated');
create policy "Users can update own notifications" on notifications
  for update using (auth.uid() = user_id);

-- 4. Chat Channels (1:1 DMs between connected users)
create table if not exists chat_channels (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid not null references profiles(id) on delete cascade,
  user2_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user1_id, user2_id)
);

alter table chat_channels enable row level security;

create policy "Users see own channels" on chat_channels
  for select using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "Users can create channels" on chat_channels
  for insert with check (auth.uid() = user1_id or auth.uid() = user2_id);

-- 5. Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references chat_channels(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Channel members see messages" on messages
  for select using (
    exists (
      select 1 from chat_channels c
      where c.id = messages.channel_id
      and (auth.uid() = c.user1_id or auth.uid() = c.user2_id)
    )
  );
create policy "Channel members can send messages" on messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from chat_channels c
      where c.id = messages.channel_id
      and (auth.uid() = c.user1_id or auth.uid() = c.user2_id)
      and not exists (
        select 1 from blocks b
        where (b.blocker_id = c.user1_id and b.blocked_id = c.user2_id)
           or (b.blocker_id = c.user2_id and b.blocked_id = c.user1_id)
      )
    )
  );

-- Enable Realtime on messages table
alter publication supabase_realtime add table messages;

-- 6. Storage: avatars bucket RLS (create bucket named "avatars" in Dashboard first)
-- Recommended bucket settings in the Supabase Dashboard:
-- * Public bucket: true
-- * Restrict file size: 512000 bytes (500KB)
-- * Restrict MIME types: image/jpeg, image/png, image/webp, image/gif
--
-- create policy "Users can upload own avatar"
--   on storage.objects for insert
--   with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Users can update own avatar"
--   on storage.objects for update
--   using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- create policy "Avatars are publicly readable"
--   on storage.objects for select
--   using (bucket_id = 'avatars');

-- 7. User Blocks
create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (blocker_id, blocked_id)
);

alter table blocks enable row level security;

create policy "Users can see who they blocked" on blocks
  for select using (auth.uid() = blocker_id);

create policy "Users can block others" on blocks
  for insert with check (auth.uid() = blocker_id);

create policy "Users can unblock others" on blocks
  for delete using (auth.uid() = blocker_id);
