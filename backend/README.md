# ErrorLens Backend

This backend provides the API for the ErrorLens dashboard.

## Setup

1. Copy `.env.example` to `.env`.
2. Update PostgreSQL settings.
3. Create the database and run `backend/db/init.sql`.
4. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Tests

Backend integration tests use PostgreSQL and clear their tables between tests.
Run them only against a dedicated database named `error_lens_test`; the test
suite refuses to run against any other database.

```bash
TEST_DATABASE_URL=postgres://postgres:postgres@localhost:5432/error_lens_test \
JWT_SECRET=local-test-secret \
npm test
```

GitHub Actions starts this disposable database automatically for pull requests
and pushes to `main`.

## API

### Authentication

Most API endpoints require a JWT token. Include the token in the request headers as:

```http
Authorization: Bearer <token>
```

### Authentication Endpoints

- `POST /auth/register` - Register a new user with `email` and `password`.
- `POST /auth/login` - Login and receive a JWT token in the response.

### Protected Event Endpoints

- `POST /events` - Create an event for the authenticated user.
- `GET /events` - Fetch events scoped to the authenticated user. Supports optional filters.
- `GET /events?severity=&environment=` - Fetch user-specific events by filter.
- `GET /events/summary` - Get aggregated event statistics for the authenticated user.

> Events are now scoped per authenticated user and are no longer global.
