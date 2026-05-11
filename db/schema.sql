-- PostgreSQL schema (simplified)

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  created_at timestamptz DEFAULT now(),
  plan text DEFAULT 'free'
);

CREATE TABLE conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  source_mime text NOT NULL,
  target_mime text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'queued',
  input_path text,
  output_path text,
  error text,
  size_bytes bigint
);

CREATE TABLE conversion_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversion_id uuid REFERENCES conversions(id) ON DELETE CASCADE,
  queue_name text,
  attempt int DEFAULT 0,
  started_at timestamptz,
  finished_at timestamptz,
  meta jsonb
);

CREATE INDEX idx_conversions_status ON conversions(status);

CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  properties jsonb,
  session_id text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
