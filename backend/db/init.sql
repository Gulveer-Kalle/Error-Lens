DROP TABLE IF EXISTS events;

-- users table for authentication
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,

  application TEXT NOT NULL,
  message TEXT NOT NULL,

  severity VARCHAR(20) NOT NULL
    CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  environment VARCHAR(20) NOT NULL
    CHECK (environment IN ('development', 'staging', 'production')),

  event_type VARCHAR(20) NOT NULL DEFAULT 'error'
    CHECK (event_type IN ('error', 'warning', 'info')),

  source TEXT NOT NULL DEFAULT 'unknown',

  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO events (application, message, severity, environment, event_type, source)
VALUES
  ('frontend', 'UI load failure in dashboard', 'high', 'staging', 'error', 'frontend'),
  ('backend', 'Database connection error', 'critical', 'production', 'error', 'backend'),
  ('worker', 'Background job timed out', 'medium', 'production', 'warning', 'api'),
  ('auth-service', 'Login attempt failed', 'low', 'development', 'info', 'backend'),
  ('checkout-service', 'Unhandled promise rejection', 'critical', 'production', 'error', 'frontend');