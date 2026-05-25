CREATE TABLE IF NOT EXISTS planning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  project text NOT NULL DEFAULT '',
  scale text NOT NULL DEFAULT 'fibonacci',
  custom_scale text[] NOT NULL DEFAULT '{}',
  created_by text NOT NULL,
  current_task_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planning_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES planning_sessions(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  added_by text NOT NULL,
  estimate text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planning_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES planning_sessions(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planning_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES planning_tasks(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES planning_sessions(id) ON DELETE CASCADE,
  participant text NOT NULL,
  value text,
  revealed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT planning_votes_task_id_participant_key UNIQUE (task_id, participant)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON planning_sessions, planning_tasks, planning_participants, planning_votes TO public;
