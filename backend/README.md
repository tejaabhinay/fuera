# FUERA API

Express 5 + MongoDB service backing the FUERA sports fest site. Serves public content
(sports, fixtures, timeline, archive photos) and the authenticated admin dashboard.

## Setup

```bash
npm install
cp .env.example .env   # then fill it in
npm start              # or: npx nodemon server.js
```

Every variable is documented in `.env.example`. The two that matter most:

- **`MONGODB_URI`** — without it the process still starts, but every content endpoint
  answers `503` and `/ready` reports `not_ready`.
- **`CORS_ALLOWED_ORIGINS`** — a comma-separated origin allowlist. If it is unset the API
  accepts every origin and logs a `cors_allowlist_missing` warning at boot. **Always set it
  in production.**

Create the first administrator with `node scripts/createAdmin.js`, or through the
`/admin/signup` page, which closes itself once one admin exists.

## Health

| Route | Meaning |
| --- | --- |
| `GET /health` | Process is up. Never rate limited — safe for uptime monitors. |
| `GET /ready` | Process is up **and** MongoDB is connected. Use this as the deploy gate. |

## Request handling

Requests pass through, in order: request id + access logging, `helmet`, `compression`,
CORS, a 100 kb JSON body cap, then a global rate limiter on `/api`.

Every response carries an `X-Request-Id`. A `500` logs the same id alongside the stack, so
a user-reported error can be found in the logs by that one value.

### Rate limits

| Scope | Limit |
| --- | --- |
| `POST /api/auth/login` | 10 per 15 min per IP |
| `POST /api/auth/signup` | 5 per hour per IP |
| `POST /api/registrations` | 15 per hour per IP |
| `POST /api/uploads/image` | 60 per hour **per admin** |
| everything under `/api` | 600 per 15 min per IP |

`app.set('trust proxy', 1)` is required for these to key on the real client IP behind
Render's proxy. If you move to a host with a different proxy depth, update that value.

### Caching

Public `GET` routes send `Cache-Control: public, max-age=…, stale-while-revalidate=…`.
Any request carrying an `Authorization` header gets `no-store` instead, so a shared cache
can never retain an admin's response.

## Logging

One JSON object per line via `config/logger.js` — greppable in Render's log viewer:

```json
{"level":"info","time":"…","message":"request","requestId":"…","method":"GET","path":"/api/sports","status":200,"durationMs":12.4}
```

## Notes

- **Startup is resilient, not infallible.** `connectDatabase` retries 5 times with
  exponential backoff. If all attempts fail the process still listens so `/health` and
  `/ready` stay answerable, and mongoose reconnects on its own once MongoDB returns.
- **`SIGTERM`/`SIGINT`** stop new connections, drain in-flight requests, close MongoDB,
  then exit — with a 10 s hard timeout.
- **`FORCE_PUBLIC_DNS=true`** overrides the DNS resolver process-wide with 8.8.8.8 /
  1.1.1.1. It only exists because some Windows setups fail Atlas SRV lookups. Leave it
  unset in production.
- **`POST /api/registrations` currently has no caller.** Registration goes through the
  Google Form URL configured per sport. The endpoint, the `Registration` model and
  `services/registrationService.js` work, but nothing in the frontend uses them — wire it
  up or delete it.
