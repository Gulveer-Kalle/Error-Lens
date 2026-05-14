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

## API

- `GET /events`
- `POST /events`
- `GET /events?severity=&environment=`
- `GET /events/summary`
