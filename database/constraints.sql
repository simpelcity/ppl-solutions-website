-- drop constraints
alter table public.profiles
drop constraint if exists users_created_at_fkey;

-- links public.profiles.created_at to auth.users.created_at
alter table public.profiles
add constraint users_created_at_fkey
foreign key (created_at)
references auth.users(created_at);