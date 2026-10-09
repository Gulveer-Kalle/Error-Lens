# Error-Lens
SaaS style error tracking and monitoring dashboard built with Angular, Node.js, PostgreSQL, and AWS.

## Continuous integration

GitHub Actions runs the frontend tests and production build, plus backend API
integration tests, on pull requests and pushes to `main`. The backend job uses
an isolated PostgreSQL service; its test-only JWT secret is not used in
production.

To run the backend integration tests locally, start a dedicated PostgreSQL
database named `error_lens_test`, then set `TEST_DATABASE_URL` and `JWT_SECRET`
before running:

```bash
cd backend
npm ci
npm test
```

The tests clear data in `error_lens_test`; they refuse to run against any other
database. The frontend tests and production build can be run with:

```bash
cd frontend
npm ci
npm test -- --watch=false
npm run build
```

## Deployment

Render continues to deploy the backend and frontend using `render.yaml`. For
each service in Render, set **Auto-Deploy** to **After CI Checks Pass** so
deployments wait for the GitHub Actions checks. Keep production credentials such
as `DATABASE_URL` and `JWT_SECRET` in Render's environment settings, not in the
repository or CI workflow. The backend accepts Render's `DATABASE_URL` as well
as the individual `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`
settings used by local installations.
