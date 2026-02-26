-- STORAGE POLICIES (ADMIN-ONLY) for bucket "publics"
-- Run in Supabase SQL Editor

-- 1) Make sure bucket exists (do this in Storage UI too)
-- Bucket: publics

-- 2) Allow admins to list/view/upload/delete objects in this bucket.
-- Policies are on storage.objects (NOT your public tables).

-- Helper: admin check that avoids recursion:
-- (admin_users table must have RLS that allows users to read their own row OR be readable by service role only)
-- This policy uses a direct exists lookup.

alter table storage.objects enable row level security;

-- SELECT (list/view) for admins
drop policy if exists "admin can read site media" on storage.objects;
create policy "admin can read site media"
on storage.objects for select
to authenticated
using (
  bucket_id = 'publics'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);

-- INSERT (upload) for admins
drop policy if exists "admin can upload site media" on storage.objects;
create policy "admin can upload site media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'publics'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);

-- UPDATE (optional)
drop policy if exists "admin can update site media" on storage.objects;
create policy "admin can update site media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'publics'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
)
with check (
  bucket_id = 'publics'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);

-- DELETE for admins
drop policy if exists "admin can delete site media" on storage.objects;
create policy "admin can delete site media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'publics'
  and exists (select 1 from public.admin_users au where au.user_id = auth.uid())
);

-- NOTE:
-- If you previously got "infinite recursion detected in policy for relation admin_users",
-- your admin_users policies likely reference admin_users again.
-- Keep admin_users policies SIMPLE, e.g.:
-- create policy "admin_users read self" on public.admin_users for select to authenticated using (user_id = auth.uid());
