create table if not exists os_snapshots (
  user_id    text primary key,
  payload    text not null,
  updated_at timestamptz not null default now()
);
