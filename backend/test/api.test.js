const assert = require("node:assert/strict");
const { after, before, beforeEach, test } = require("node:test");
const { once } = require("node:events");
const app = require("../src/index");
const pool = require("../src/db");

const databaseUrl = process.env.TEST_DATABASE_URL;
let server;
let baseUrl;

before(async () => {
  if (!databaseUrl) {
    throw new Error(
      "TEST_DATABASE_URL must point to a dedicated PostgreSQL database named error_lens_test"
    );
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be set to run the backend tests");
  }

  const { rows } = await pool.query("SELECT current_database() AS name");
  assert.equal(
    rows[0].name,
    "error_lens_test",
    "Refusing to run destructive API tests outside error_lens_test"
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS events (
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
    )
  `);

  server = app.listen(0);
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await pool.query("TRUNCATE events, users RESTART IDENTITY CASCADE");
});

after(async () => {
  if (server) {
    server.close();
    await once(server, "close");
  }
  await pool.end();
});

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  return {
    response,
    data: text
      ? response.headers.get("content-type")?.includes("application/json")
        ? JSON.parse(text)
        : text
      : undefined,
  };
}

async function createUser(email) {
  const registration = await request("/auth/register", {
    method: "POST",
    body: { email, password: "correct-horse-battery" },
  });
  assert.equal(registration.response.status, 200);

  const login = await request("/auth/login", {
    method: "POST",
    body: { email, password: "correct-horse-battery" },
  });
  assert.equal(login.response.status, 200);
  return login.data.token;
}

async function createEvent(token, overrides = {}) {
  return request("/events", {
    method: "POST",
    token,
    body: {
      application: "test-app",
      message: "Test event",
      severity: "high",
      environment: "staging",
      ...overrides,
    },
  });
}

test("health endpoint responds successfully", async () => {
  const { response, data } = await request("/");

  assert.equal(response.status, 200);
  assert.equal(data, "ErrorLens API is running");
});

test("protected event endpoints reject missing and invalid tokens", async () => {
  const missing = await request("/events");
  const invalid = await request("/events", { token: "not-a-valid-token" });

  assert.equal(missing.response.status, 401);
  assert.equal(invalid.response.status, 401);
});

test("registration validates input, rejects duplicate email, and login issues a token", async () => {
  const invalid = await request("/auth/register", {
    method: "POST",
    body: { email: "", password: "password" },
  });
  assert.equal(invalid.response.status, 400);

  const token = await createUser("first@example.test");
  const duplicate = await request("/auth/register", {
    method: "POST",
    body: { email: "first@example.test", password: "another-password" },
  });
  const badLogin = await request("/auth/login", {
    method: "POST",
    body: { email: "first@example.test", password: "wrong-password" },
  });

  assert.equal(duplicate.response.status, 400);
  assert.equal(badLogin.response.status, 400);
  assert.equal(typeof token, "string");

  const { rows } = await pool.query(
    "SELECT password FROM users WHERE email = $1",
    ["first@example.test"]
  );
  assert.notEqual(rows[0].password, "correct-horse-battery");
});

test("event creation validates values and listing is filtered and scoped to its owner", async () => {
  const firstUser = await createUser("first@example.test");
  const secondUser = await createUser("second@example.test");

  const invalid = await createEvent(firstUser, { severity: "urgent" });
  const firstEvent = await createEvent(firstUser, { severity: "critical" });
  const secondEvent = await createEvent(secondUser, { severity: "critical" });
  const filtered = await request("/events?severity=critical&environment=staging", {
    token: firstUser,
  });

  assert.equal(invalid.response.status, 400);
  assert.equal(firstEvent.response.status, 201);
  assert.equal(firstEvent.data.event_type, "error");
  assert.equal(firstEvent.data.source, "unknown");
  assert.equal(secondEvent.response.status, 201);
  assert.equal(filtered.response.status, 200);
  assert.deepEqual(
    filtered.data.map((event) => event.id),
    [firstEvent.data.id]
  );
});

test("summary only counts events belonging to the authenticated user", async () => {
  const firstUser = await createUser("first@example.test");
  const secondUser = await createUser("second@example.test");

  await createEvent(firstUser);
  await createEvent(firstUser, {
    severity: "low",
    environment: "production",
    event_type: "warning",
  });
  await createEvent(secondUser);

  const { response, data } = await request("/events/summary", {
    token: firstUser,
  });

  assert.equal(response.status, 200);
  assert.equal(data.total, 2);
  assert.equal(data.last24h, 2);
  assert.deepEqual(
    Object.fromEntries(data.severity.map(({ severity, count }) => [severity, count])),
    { high: 1, low: 1 }
  );
  assert.deepEqual(
    Object.fromEntries(data.eventType.map(({ event_type, count }) => [event_type, count])),
    { error: 1, warning: 1 }
  );
  assert.deepEqual(
    Object.fromEntries(data.environment.map(({ environment, count }) => [environment, count])),
    { production: 1, staging: 1 }
  );
});

test("event deletion enforces ownership and reports missing events", async () => {
  const owner = await createUser("owner@example.test");
  const otherUser = await createUser("other@example.test");
  const created = await createEvent(owner);

  const forbidden = await request(`/events/${created.data.id}`, {
    method: "DELETE",
    token: otherUser,
  });
  assert.equal(forbidden.response.status, 403);

  const deleted = await request(`/events/${created.data.id}`, {
    method: "DELETE",
    token: owner,
  });
  const missing = await request(`/events/${created.data.id}`, {
    method: "DELETE",
    token: owner,
  });

  assert.equal(deleted.response.status, 204);
  assert.equal(missing.response.status, 404);
});
