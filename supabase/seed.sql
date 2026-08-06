-- Seed data for Cyber Talent Room

-- Insert Users into auth.users (this will trigger the profiles creation)
-- Passwords are set to 'password123'
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change_token_new, recovery_token, email_change)
VALUES
  -- Admin
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin Instructor","role":"admin"}', now(), now(), '', '', '', ''),
  -- Students
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'emma@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Emma Watson","role":"student"}', now(), now(), '', '', '', ''),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'michael@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Michael Johnson","role":"student"}', now(), now(), '', '', '', ''),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah@example.com', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Jenkins","role":"student"}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- Explicitly insert profiles in case the trigger is disabled or fails during seed
INSERT INTO public.profiles (id, full_name, role, xp, stars)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Admin Instructor', 'admin', 0, 0),
  ('22222222-2222-2222-2222-222222222222', 'Emma Watson', 'student', 2450, 14),
  ('33333333-3333-3333-3333-333333333333', 'Michael Johnson', 'student', 2210, 12),
  ('44444444-4444-4444-4444-444444444444', 'Sarah Jenkins', 'student', 2150, 10)
ON CONFLICT (id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  xp = EXCLUDED.xp,
  stars = EXCLUDED.stars;

-- Profile XP and Stars are already set in the explicit insert above

-- Insert Assignments
INSERT INTO public.assignments (id, title, description, due_date, instructor_id)
VALUES 
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'React Hooks Project', 'Build a simple app using useState and useEffect', now() + interval '1 day', '11111111-1111-1111-1111-111111111111'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CSS Grid Layout', 'Create a responsive dashboard layout using CSS Grid', now() - interval '2 days', '11111111-1111-1111-1111-111111111111'),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'JavaScript Basics', 'Complete the basic JS exercises', now() + interval '5 days', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- Insert Submissions
INSERT INTO public.submissions (id, assignment_id, student_id, status, score, submitted_at)
VALUES
  -- Emma submitted React Hooks (Pending)
  (uuid_generate_v4(), 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'pending', null, now() - interval '2 hours'),
  -- Michael submitted React Hooks (Pending)
  (uuid_generate_v4(), 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'pending', null, now() - interval '1 hour'),
  -- Emma submitted CSS Grid (Graded)
  (uuid_generate_v4(), 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'graded', 95, now() - interval '3 days'),
  -- Sarah submitted CSS Grid (Graded)
  (uuid_generate_v4(), 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'graded', 88, now() - interval '3 days')
ON CONFLICT DO NOTHING;
