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
