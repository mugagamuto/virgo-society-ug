-- ============================
-- SEED DATA (for testing only)
-- Run this in Supabase SQL Editor
-- ============================

-- Members (no auth linkage for seed; using random UUIDs)
insert into public.members (user_id, org_name, contact_name, phone, email, location, district, status)
values
  (gen_random_uuid(), 'Kampala Youth Savings Group', 'Sarah Namusoke', '+256 701 111111', 'kampalayouth@example.com', 'Kampala', 'Central', 'active'),
  (gen_random_uuid(), 'Gulu Women in Business', 'Grace Akello', '+256 703 222222', 'guluwomen@example.com', 'Gulu', 'Northern', 'active'),
  (gen_random_uuid(), 'Mbarara Community Farmers', 'John Tumusiime', '+256 704 333333', 'mbararafarmers@example.com', 'Mbarara', 'Western', 'suspended')
on conflict (user_id) do nothing;

-- Projects (make sure your projects table has these columns)
-- id, title, org_name, location, district, status, submitted_at, is_fundable, funded_ugx, goal_ugx, created_at, updated_at
insert into public.projects (title, org_name, location, district, status, submitted_at, is_fundable, funded_ugx, goal_ugx)
values
  ('Solar Study Lamps for Rural Students', 'Kampala Youth Savings Group', 'Kampala', 'Central', 'submitted', now(), false, 0, 3500000),
  ('Chicken Rearing Starter Kits', 'Gulu Women in Business', 'Gulu', 'Northern', 'pending', now(), false, 0, 5000000),
  ('Maize Milling Community Project', 'Mbarara Community Farmers', 'Mbarara', 'Western', 'approved', now(), true, 1200000, 8000000),
  ('Clean Water Tank for Village School', 'Gulu Women in Business', 'Gulu', 'Northern', 'rejected', now(), false, 0, 2500000),
  ('Tailoring Training & Machines', 'Kampala Youth Savings Group', 'Kampala', 'Central', 'approved', now(), true, 4500000, 6000000)
on conflict do nothing;

-- Optional: quick sanity checks
-- select status, count(*) from public.projects group by status order by status;
-- select status, count(*) from public.members group by status order by status;
