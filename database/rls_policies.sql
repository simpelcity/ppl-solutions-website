-- ============================================================
-- ENABLE RLS
-- ============================================================

alter table public.department_team_member enable row level security;
alter table public.departments enable row level security;
alter table public.gallery enable row level security;
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.team_members enable row level security;