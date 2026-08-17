create table enrollments (
  id_student uuid primary key default gen_random_uuid(),
  student_name text not null,
  program text not null,
  session_package int not null check (session_package in (4, 8, 12)),
  session_duration int not null check (session_duration in(60, 90, 120)),
  mode text not null check (mode in ('online', 'offline')),
  created_at timestamptz not null default now()
);

create table sessions (
  id_session uuid primary key default gen_random_uuid(),
  student_id uuid not null references enrollments(id_student) on delete cascade,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  location text not null,
  material text not null,
  created_at timestamptz not null default now()
);

create index idx_sessions_enrollment_date on sessions (student_id, session_date);