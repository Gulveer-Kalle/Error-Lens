# ErrorLens - Error Monitoring Dashboard

[![CI](https://github.com/Gulveer-Kalle/Error-Lens/actions/workflows/ci.yml/badge.svg)](https://github.com/Gulveer-Kalle/Error-Lens/actions/workflows/ci.yml)

A full-stack error monitoring application for submitting, organizing, and reviewing application events from a web dashboard.

---

## 📌 Description

**ErrorLens** lets users record errors, warnings, and informational events for their applications, then review those events and summary statistics in one place. Each user's events are kept separate behind authenticated API access.

The project includes an Angular frontend, a Node.js and Express REST API, and a PostgreSQL database. GitHub Actions runs the backend integration tests, frontend tests, and frontend production build when changes are pushed to `main` or submitted in a pull request.

---

## Features ✅

### 🔐 Authentication and access

- Register and sign in with an email and password.
- Passwords are hashed before being stored.
- JWT-protected API endpoints.
- Dashboard and application pages require authentication.
- Copy the current API token from Settings for API requests.

### 📊 Event monitoring

- Submit events with an application, message, severity, environment, event type, and source.
- Supported severities: `low`, `medium`, `high`, `critical`.
- Supported environments: `development`, `staging`, `production`.
- Supported event types: `error`, `warning`, `info`.
- Filter the event list by severity and environment.
- View totals, events from the last 24 hours, and breakdowns by severity, event type, and environment.
- Delete events belonging to your account.

### 🔌 API and account settings

- Browse API endpoint documentation and example requests in the application.
- Copy your API token from Settings.
- Delete your account and its associated events.

---

## 🛠 Technologies

- **Angular** - Web application and dashboard
- **Node.js and Express** - REST API and frontend static server
- **PostgreSQL** - User and event data
- **JWT** - Authenticated API access
- **bcryptjs** - Password hashing
- **GitHub Actions** - Automated tests and build checks
- **Render** - Deployment configuration in `render.yaml`

---

## 📂 Project structure

```text
.
├── .github/workflows/ci.yml  # GitHub Actions CI workflow
├── backend/
│   ├── db/init.sql           # Local database schema and sample events
│   ├── src/                  # Express API, routes, controllers, and database
│   └── test/api.test.js      # Backend API integration tests
├── frontend/
│   └── src/                  # Angular app, components, pages, and tests
├── errorlens/                # Early Python client prototype
├── render.yaml               # Render service configuration
└── README.md
```

---

## 🖥 Run locally

### 1. Set up the database

Create a **new, empty local development database** named `error_lens`. The SQL initialization script drops and recreates the `events` and `users` tables, so **do not run it against a database containing data you need to keep**.

Run the schema script from the repository root:

```bash
psql -U postgres -d error_lens -f backend/db/init.sql
```

The script creates the tables and inserts seed events.

### 2. Configure and start the backend

In a terminal, set the PostgreSQL connection settings and a JWT secret, then install dependencies and start the API:

```bash
cd backend
npm ci
```

Create `backend/.env` with values for your local setup:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-local-postgres-password
DB_NAME=error_lens
JWT_SECRET=replace-with-a-long-random-local-secret
PORT=5000
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Start the frontend

In another terminal:

```bash
cd frontend
npm ci
npx ng serve
```

Open the Angular development server URL printed in the terminal (typically `http://localhost:4200`). The local frontend configuration points to the API at `http://localhost:5000`.

To serve the production build with the included Express static server instead:

```bash
npm run build
npm start
```

---

## 🔌 REST API

The local API base URL is `http://localhost:5000`. Register and log in through the API or web application, then send the returned JWT as a bearer token for protected routes:

```http
Authorization: Bearer <token>
```

### Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/` | API health check | Public |
| `POST` | `/auth/register` | Register with `email` and `password` | Public |
| `POST` | `/auth/login` | Log in and receive a JWT | Public |
| `DELETE` | `/auth` | Delete the authenticated account and its events | Authenticated |
| `POST` | `/events` | Submit an event | Authenticated |
| `GET` | `/events` | List the authenticated user's events | Authenticated |
| `GET` | `/events/summary` | Get the authenticated user's event counts | Authenticated |
| `DELETE` | `/events/:id` | Delete an event owned by the authenticated user | Authenticated |

`GET /events` accepts optional `severity` and `environment` query parameters. New events require `application`, `message`, `severity`, and `environment`; `event_type` and `source` are optional.

Example event request:

```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "application": "checkout-service",
    "message": "Database connection failed",
    "severity": "critical",
    "environment": "production",
    "event_type": "error",
    "source": "api"
  }'
```

---

## ✅ Tests and CI

GitHub Actions runs the following checks on pull requests and pushes to `main`:

- **Backend tests:** starts a temporary PostgreSQL 16 service, installs backend dependencies, and runs the API integration tests.
- **Frontend tests and build:** installs frontend dependencies, runs Angular tests in non-watch mode, and creates a production build.

To run the frontend checks locally:

```bash
cd frontend
npm ci
npm test -- --watch=false
npm run build
```

Backend tests clear and repopulate their tables between tests. Run them only against a dedicated database named `error_lens_test`; the test suite checks the connected database name and refuses to run against another database.

```bash
cd backend
npm ci
```

Set `TEST_DATABASE_URL` to the dedicated test database and `JWT_SECRET` before running `npm test`. For example, in PowerShell:

```powershell
$env:TEST_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/error_lens_test"
$env:JWT_SECRET = "local-test-secret"
npm test
```

The CI workflow supplies its own disposable test database and test-only JWT secret. Production credentials should not be placed in the workflow or committed to the repository.

---

## 🚀 Deployment

`render.yaml` defines separate Render web services for the backend and frontend. Configure the backend's `DATABASE_URL` and `JWT_SECRET` as Render environment variables. The frontend's production API URL is configured in `frontend/src/environments/environment.prod.ts`; set it to the deployed backend URL before building the production frontend.

For deployments to wait for GitHub Actions checks, configure each Render service's Auto-Deploy setting to **After CI Checks Pass**. The GitHub Actions workflow itself tests and builds the project; Render handles deployment.

---

## 📸 Screenshots and downloads

No application screenshots or downloadable release binaries are currently included in this repository. (Coming Soon!)

---

## 🔮 Possible future enhancements

- Add pagination controls to the dashboard event list.
- Add event search and date-range filters.
- Turn the early Python client prototype into an installable, configurable SDK for authenticated event submission.
- Add deployment status checks or release automation.

---

## 💡 Project highlights

- Full-stack application with an Angular dashboard and REST API.
- Authenticated user-scoped event data.
- Integration tests against PostgreSQL and isolated frontend component tests.
- Automated CI checks for tests and production build.
- Render configuration for separate frontend and backend services.
