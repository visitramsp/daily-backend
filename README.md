# Dayly — Backend

REST API using **Node.js, Express, MongoDB / Mongoose, Zod, Helmet, CORS, express-rate-limit and Morgan**.

## Requirements

- Node.js 20+
- MongoDB local server or MongoDB Atlas cluster

## Start

```bash
npm install
```

Copy `.env.example` to `.env` and configure:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dayly
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
```

Run tests: `npm test`. Production: `npm start`.

## Structure

```text
src/
├── config/          database connection
├── controllers/     HTTP handlers (thin)
├── middleware/      error handling
├── models/          Task Mongoose schema
├── repositories/    database access
├── routes/          Express routes
├── services/        task business rules and queries
├── utils/           Zod schemas, week utilities
├── app.js           Express app and middleware
└── server.js        database/bootstrap/shutdown
tests/               unit tests
```

## API endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | API health |
| GET | `/api/tasks` | List tasks |
| GET | `/api/tasks/:id` | Single task |
| POST | `/api/tasks` | Create |
| PATCH | `/api/tasks/:id` | Update |
| DELETE | `/api/tasks/:id` | Delete |

List query params: `search`, `status`, `priority`, `from`, `to`, `page`, `limit`.

Example POST body:

```json
{
  "title": "Review assignment",
  "description": "Verify all task features",
  "dueAt": "2026-11-13T12:30:00.000Z",
  "priority": "high",
  "status": "in_progress"
}
```

Status values are `in_progress` and `completed`. Priority values are `low`, `medium` and `high`. Dates are timezone-aware ISO strings. All endpoints return JSON except successful DELETE (204).

## Deploy to Netlify

This repository is configured for Netlify Functions. The Express app is exposed
at the same `/api/*` paths listed above; do **not** use `npm start` on Netlify.

1. Push this folder to GitHub/GitLab/Bitbucket and import the repository in
   Netlify. The committed configuration runs `npm ci`, publishes only `public/`,
   and deploys the function automatically. Do not upload the local `.env` file.
2. In **Site configuration → Environment variables**, add:
   - `MONGODB_URI`: your MongoDB Atlas connection string (use a database user
     with only the permissions this app needs).
   - `NODE_ENV`: `production`.
3. In MongoDB Atlas **Network Access**, allow connections from Netlify. Netlify
   Functions do not use fixed outbound IP addresses, so Atlas commonly requires
   `0.0.0.0/0`; protect the database with a strong, least-privilege database user.
4. Deploy. Test `https://YOUR-SITE.netlify.app/api/health` — it should return
   `{ "status": "ok" }`.

`netlify.toml` routes `/api/*` to `netlify/functions/api.js`, and the function
reuses the MongoDB connection while an instance stays warm. This demo does not
include authentication; it uses a shared task collection.

Functions use the `esbuild` bundler for the ES module entry point. Mongoose is
externalized so Netlify packages it and its dependencies as Node modules instead
of bundling the database driver. All runtime dependencies, including Express and
`serverless-http`, are declared in `package.json` and pinned by `package-lock.json`.

The public API allows cross-origin requests from any website without cookie
credentials. Browser clients should omit `credentials: 'include'`. CORS preflight
requests and `/api/health` do not need a database connection. The health endpoint
reports that the API is running; task endpoints return HTTP 503 with CORS headers
when MongoDB is unavailable. Postman does not enforce browser CORS restrictions.

If task endpoints return 503, verify MongoDB connectivity, TLS support, database
credentials, and Atlas Network Access for Netlify's outbound connections. If a
deploy URL returns a Netlify login page or HTTP 401, check project access settings
under **Project configuration → General → Visitor access**; that
protection runs before the API and cannot be changed by Express CORS headers.
