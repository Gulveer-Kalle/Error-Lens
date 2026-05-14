CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  application TEXT NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  environment VARCHAR(20) NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO events (application, message, severity, environment)
VALUES
  ('frontend', 'UI load failure in dashboard', 'high', 'staging'),
  ('backend', 'Database connection error', 'critical', 'production'),
  ('worker', 'Background job timed out', 'medium', 'production');
