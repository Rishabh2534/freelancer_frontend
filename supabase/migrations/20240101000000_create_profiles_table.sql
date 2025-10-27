-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  role text check (role in ('freelancer', 'client')),
  location text,
  bio text,
  website text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
-- Allow public read access
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using (true);

-- Allow authenticated users to update their own profile
create policy "Users can update their own profile."
  on profiles for update
  using (auth.uid() = id);

-- Create a trigger to automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update the Database types
comment on table profiles is 'Public profiles of users';
comment on column profiles.id is 'References the user ID from auth.users';
comment on column profiles.full_name is 'The user''s full name';
comment on column profiles.avatar_url is 'The user''s avatar URL';
comment on column profiles.role is 'The user''s role (freelancer or client)';
comment on column profiles.location is 'The user''s location';
comment on column profiles.bio is 'The user''s bio';
comment on column profiles.website is 'The user''s website';