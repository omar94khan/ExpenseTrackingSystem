# Expense Tracking System — Backend Documentation

> Generated from the current state of the codebase. This reflects what the code **actually does**, not what it's planned to do — including a few inconsistencies that are noted at the bottom rather than silently glossed over.

---

## 1. Overview

This is a FastAPI backend for a personal expense tracking application. It exposes a REST API for:

- User registration, lookup, and deletion
- JWT-based authentication
- Transaction (income/expense/transfer) CRUD
- A basic monthly spending report generated with pandas

Data is persisted via SQLAlchemy ORM, defaulting to a local SQLite file (`transactions.db`) but configurable to any SQLAlchemy-supported database via `DATABASE_URL`.

---

## 2. Tech Stack

| Layer | Library | Purpose |
|---|---|---|
| Web framework | FastAPI | Routing, validation, dependency injection, OpenAPI docs |
| ORM | SQLAlchemy | Database models & queries |
| Validation/Serialization | Pydantic | Request/response schemas |
| Auth | `python-jose` | JWT encode/decode |
| Password hashing | `passlib[bcrypt]` | One-way password hashing |
| Data analysis | `pandas` | Monthly report aggregation |
| Server | `uvicorn` | ASGI server |
| Containerization | Docker / docker-compose | Local dev environment |

---

## 3. Project Structure

```
backend/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── app/
    ├── __init__.py
    ├── main.py            # App entrypoint, CORS, router registration
    ├── config.py          # Environment-driven settings
    ├── database.py        # SQLAlchemy engine/session/Base
    ├── models.py           # ORM models (Users, Transactions)
    ├── schemas.py          # Pydantic request/response schemas
    ├── crud.py             # DB access functions
    ├── security.py         # Password hashing + JWT
    ├── deps.py              # FastAPI dependencies (get_db, get_current_user)
    ├── validations.py       # Manual field validators
    ├── analysis.py           # pandas-based reporting logic
    └── routes/
        ├── __init__.py
        ├── auth.py          # /auth/*
        ├── users.py          # /users/*
        └── transactions.py    # /transactions/*
```

---

## 4. Configuration (`config.py`)

All settings are environment-driven with local-dev-friendly fallbacks:

| Variable | Default | Notes |
|---|---|---|
| `ENV` | `local` | Should be set to `production` in prod (not currently used to branch any logic) |
| `DATABASE_URL` | `sqlite:///./transactions.db` | Any SQLAlchemy-compatible URL |
| `SECRET_KEY` | hardcoded placeholder string | **Must** be overridden via env in any real deployment — used to sign JWTs |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | JWT lifetime |
| `CORS_ORIGINS` | `*` (all) | Comma-separated list, parsed by `_split_csv` |

If `DATABASE_URL` starts with `sqlite`, `database.py` passes `check_same_thread=False` to the engine — required because SQLite by default disallows a connection being used across threads, which FastAPI's request handling will otherwise hit.

---

## 5. Database Layer (`database.py`)

```python
engine = sqlalchemy.create_engine(DATABASE_URL, connect_args=...)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

- `autocommit=False` / `autoflush=False` — standard FastAPI pattern; you control commits explicitly inside CRUD functions rather than SQLAlchemy committing implicitly mid-query.
- `Base` is the declarative base all models inherit from.
- Table creation happens once at app startup in `main.py` via `Base.metadata.create_all(bind=engine)` — this **creates missing tables but never alters existing ones** (no column add/drop/rename). Schema changes to existing tables require a manual `ALTER TABLE` or a migration tool like Alembic.

---

## 6. Data Models (`models.py`)

### `Users`
| Column | Type | Constraints |
|---|---|---|
| `id` | Integer | Primary key |
| `username` | String | Not null |
| `hashed_password` | String | Not null |
| `created_on` | DateTime | Nullable |

### `Transactions`
| Column | Type | Constraints |
|---|---|---|
| `id` | Integer | Primary key |
| `user_id` | Integer | FK → `users.id`, not null |
| `amount` | Float | Not null |
| `transaction_type` | String | Not null |
| `category` | String | Nullable |
| `date` | Date | Not null |
| `description` | String | Nullable |

A `relationship("Users", backref="transactions")` is declared on `Transactions`, which gives you `user.transactions` (list of that user's transactions) for free, in addition to the explicit `user_id` foreign key.

No `isAdmin` or role field exists on `Users` in this version of the model — there is currently no admin/role concept anywhere in the data layer.

---

## 7. Pydantic Schemas (`schemas.py`)

**Request schemas:**
- `LoginRequest` — `username`, `password` (used by `/auth/login-json`)
- `UserCreate` — `username`, `password` (plaintext, hashed server-side before storage), `created_on` (optional — defaults to today if omitted)
- `TransactionCreate` — `amount`, `transaction_type`, `category` (optional), `date`, `description` (optional)

**Response schemas:**
- `UserOut` — `id`, `username` (notably **excludes** `hashed_password` — passwords never leave the server in a response)
- `TransactionOut` — full transaction fields including `id` and `user_id`
- `Token` — `access_token`, `token_type`
- `ReportOut` — `number_of_transactions`, `transaction_month`, `total_income`, `total_expense`, `net_balance`, `most_common_expense_category`

All ORM-backed response schemas set `orm_mode = True` (Pydantic v1 style), which lets FastAPI return SQLAlchemy model instances directly and have Pydantic read attributes off them rather than requiring a dict.

---

## 8. Security (`security.py`)

| Function | What it does | Why |
|---|---|---|
| `hash_password(password)` | One-way bcrypt hash via `passlib` | Passwords are never stored in recoverable form — hashing is not encryption, there's no decrypt step. Verification always works by re-hashing the input and comparing. |
| `verify_password(plain, hashed)` | bcrypt compare | Used during login to check the submitted password against the stored hash |
| `create_access_token(data, expires_delta=None)` | Encodes a JWT with an `exp` claim, signed with `SECRET_KEY`/`ALGORITHM` | Stateless auth — server doesn't need to store sessions; the token itself proves identity until it expires |
| `decode_token(token)` | Decodes and verifies a JWT | Raises `JWTError` on invalid/expired/tampered tokens |

The JWT payload is just `{"sub": "<user_id>", "exp": ...}` — minimal claims, identity only.

---

## 9. Dependencies (`deps.py`)

- **`get_db()`** — a generator dependency that yields a `SessionLocal()` instance and guarantees `db.close()` via `finally`, regardless of whether the request succeeds or raises. This is the standard FastAPI "one DB session per request" pattern.
- **`oauth2_scheme`** — `OAuth2PasswordBearer(tokenUrl="/auth/login")`. This tells FastAPI's auto-generated docs (Swagger UI) where to send the login form, and tells FastAPI to expect a `Bearer <token>` header on protected routes.
- **`get_current_user(token, db)`** — the core auth gate:
  1. Decodes the JWT (catches `JWTError`/`ValueError` → 401)
  2. Pulls `sub` out of the payload as the user ID
  3. Looks the user up via `crud.get_user`
  4. Returns the SQLAlchemy `Users` object, or raises 401 if anything along the way fails

Any route that depends on `get_current_user` is implicitly authenticated — no token, bad token, expired token, or nonexistent user all collapse to the same 401.

---

## 10. Validation Layer (`validations.py`)

Manual (non-Pydantic) validators, called explicitly inside route handlers rather than declared as Pydantic field validators:

| Function | Rule |
|---|---|
| `validate_transaction_amount` | Must be `> 0` |
| `validate_transaction_type` | Must be `income`, `expense`, or `transfer` (case-insensitive); returns a capitalized normalized string |
| `validate_username` | 3–25 characters, alphanumeric only |
| `validate_password` | Minimum 6 characters |

Each raises a plain `ValueError` on failure, which the calling route catches and converts into an `HTTPException`.

---

## 11. CRUD Layer (`crud.py`)

| Function | Behavior |
|---|---|
| `create_user(db, user, hashed_password)` | Inserts a new `Users` row using the *already-hashed* password passed in |
| `get_user(db, user_id)` | Lookup by primary key |
| `get_user_by_username(db, username)` | Lookup by username |
| `delete_user(db, user_id)` | Deletes if found, returns `None` if not |
| `create_transaction(db, transaction, user_id)` | Verifies the user exists first; returns `None` if not, otherwise inserts |
| `get_transactions(db, user_id)` | All transactions for a user |
| `delete_transaction(db, transaction_id)` | Deletes if found, returns `None` if not |
| `get_transaction_by_id(db, transaction_id)` | Lookup by primary key |
| `fetch_report(db, user_id, from_date, to_date)` | Filters transactions by user and inclusive date range; includes two `print()` debug statements that currently ship to stdout |

CRUD functions never raise `HTTPException` themselves — they return `None`/empty results on "not found," and it's the route layer's job to translate that into an HTTP error. This keeps the CRUD layer framework-agnostic.

---

## 12. API Routes

### 12.1 Auth (`/auth`) — `auth.py`

| Method | Path | Auth required | Body | Response |
|---|---|---|---|---|
| POST | `/auth/login` | No | `application/x-www-form-urlencoded` (OAuth2 form: `username`, `password`) | `Token` |
| POST | `/auth/login-json` | No | JSON `LoginRequest` | `Token` |

Both do the same thing — look up the user by username, verify the password, and issue a JWT with `sub` set to the user's ID. Two endpoints exist because `/auth/login` follows the OAuth2 password-flow convention (form-encoded, required for Swagger UI's built-in "Authorize" button), while `/auth/login-json` exists for clients that prefer sending JSON.

### 12.2 Users (`/users`) — `users.py`

| Method | Path | Auth required | Body | Response |
|---|---|---|---|---|
| POST | `/users` | No | JSON `UserCreate` | `UserOut` |
| GET | `/users/{user_id}` | No | — | `UserOut` |
| GET | `/users/by-username/{username}` | No | — | `UserOut` |
| DELETE | `/users/{user_id}` | **Yes** | — | `UserOut` |

- **Registration (`POST /users`)** validates username and password, checks for username collision, defaults `created_on` to today if not supplied, hashes the password, and creates the user. It is intentionally open (no auth) — this is how new accounts get created.
- **Lookups** (`GET /users/{id}`, `GET /users/by-username/{username}`) are unauthenticated and return only `UserOut` (id + username — never the hash).
- **Delete (`DELETE /users/{user_id}`)** requires a valid token, and the authorization check is `current_user.id != user_id` — a user can only delete their own account. There is no separate admin-delete path in this version.

### 12.3 Transactions (`/transactions`) — `transactions.py`

| Method | Path | Auth required | Body | Response |
|---|---|---|---|---|
| POST | `/transactions/` | **Yes** | JSON `TransactionCreate` | `TransactionOut` |
| GET | `/transactions/` | **Yes** | — | `list[TransactionOut]` |
| DELETE | `/transactions/{transaction_id}` | **Yes** | — | `TransactionOut` |
| GET | `/transactions/fetch-report/` | **Yes** | Query params `from_date`, `to_date` (default: last 30 days) | raw dict (see note below) |

- **Create** validates amount (`> 0`) and type (`income`/`expense`/`transfer`) before inserting, scoped to `current_user.id` — so a user can never create a transaction on someone else's behalf.
- **List** returns all of the current user's transactions (empty list if none — not a 404).
- **Delete** fetches the transaction first, 404s if missing, 403s if it belongs to another user, then deletes.
- **Report** pulls transactions in the date range and pipes them into `analysis.analyze_report`.

### 12.4 Endpoint Summary

```
POST   /auth/login              (public)
POST   /auth/login-json         (public)
POST   /users                   (public)
GET    /users/{user_id}         (public)
GET    /users/by-username/{u}   (public)
DELETE /users/{user_id}         (self only)
POST   /transactions/           (auth)
GET    /transactions/           (auth)
DELETE /transactions/{id}       (owner only)
GET    /transactions/fetch-report/  (auth)
```

---

## 13. Reporting Logic (`analysis.py`)

`analyze_report(transactions)`:

1. Converts the list of ORM `Transactions` objects to a list of dicts via `model_to_dict` (uses SQLAlchemy's `inspect()` to grab column attributes generically — works for any model, not hardcoded to specific field names).
2. Loads into a pandas `DataFrame`, normalizes dates to strings then back to datetime, lowercases `transaction_type`.
3. Returns an early `{"message": "No transactions to analyze."}` if the DataFrame is empty.
4. Buckets transactions by calendar month (`dt.to_period("M")`), and for each month computes:
   - `transaction_month` — display label like `Dec-2025`
   - `total_income` — sum of amounts where type is `income`
   - `total_expense` — sum of amounts where type is `expense`
   - `most_common_expense_category` — mode of `category` among `expense` rows, or `None` if there are no expense rows that month
5. Sorts months newest-first and returns a dict keyed by `transaction_month`.

This function is called directly from the route with no response model enforced (the route has no `response_model=` set), so whatever shape `analyze_report` returns is what the client gets verbatim.

---

## 14. Application Entrypoint (`main.py`)

```python
Base.metadata.create_all(bind=engine)   # creates tables if they don't exist
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS or ["*"], ...)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(transactions.router)
```

- Table creation runs at import time, before the app object is even built — meaning it happens once per process start, every time the server boots (including on `--reload` restarts in dev).
- CORS currently allows all methods and headers, and falls back to `*` origins if `CORS_ORIGINS` isn't set — fine for local dev, worth tightening for any public deployment.
- Three routers are registered: `auth`, `users`, `transactions`. There is no separate admin/user-management router in this codebase snapshot.

---

## 15. Docker & Deployment

**`Dockerfile`** — `python:3.11-slim` base, installs `build-essential` (needed for compiling bcrypt's native extension), installs from `requirements.txt`, copies the app, runs `uvicorn app.main:app` on port 8000.

**`docker-compose.yml`** —
- Single `backend` service, built from the local Dockerfile
- Loads env vars from `.env` (which is git-ignored)
- Bind-mounts `./app` into the container at `/app/app` — so local file edits are reflected live
- Names volume `sqlite_data` mounted at `/app/transactions_data` for persistence (note: this volume path doesn't match `DATABASE_URL`'s default of `./transactions.db` relative to the working directory — worth double-checking that the SQLite file is actually landing inside the volume you intend)
- Overrides the container `CMD` to run uvicorn with `--reload`, which is dev-only behavior (auto-restarts on file change, not something you'd want in prod)

---

## 16. End-to-End Auth Flow

1. Client calls `POST /auth/login` (form) or `/auth/login-json` (JSON) with credentials.
2. Server looks up the user, verifies the bcrypt hash, and — if valid — signs a JWT containing `sub: <user_id>` and an expiry.
3. Client stores the token (currently `localStorage` on the frontend, per your established pattern) and sends it as `Authorization: Bearer <token>` on every subsequent protected request.
4. `get_current_user` decodes the token on each protected route, re-fetches the user from the DB (so a deleted user's old token stops working even before expiry), and injects the `Users` object into the route function.
5. Route-level logic then does its own ownership checks (e.g., "is this your transaction?", "is this your own account?") using `current_user.id`.

---

## 17. Current Behavior Notes (as-is observations)

These aren't bugs in the sense of crashing anything — they're just things worth knowing about because they affect actual runtime behavior:

- **`validate_transaction_type`'s normalized return value is discarded.** The route calls it for its side effect of *raising* on invalid input, but then passes the original (non-normalized) `transaction` object into `crud.create_transaction`. So whatever casing the client sent is what actually gets stored — the capitalization normalization never reaches the database.
- **Broad `except:` clauses in route validation.** In `users.py` and `transactions.py`, validation failures are caught with bare `except:` and replaced with a generic message (e.g., `"Invalid username"`), discarding the specific reason from the `ValueError` (e.g., "must be alphanumeric" vs. "too short"). Functionally fine, but the client never sees *why* something failed.
- **`ReportOut` schema isn't actually enforced.** It defines `number_of_transactions` and `net_balance`, but `/transactions/fetch-report/` has no `response_model=schemas.ReportOut`, and `analyze_report()` doesn't compute either of those two fields — only `transaction_month`, `total_income`, `total_expense`, and `most_common_expense_category` are populated. The schema and the actual response have drifted apart.
- **No role/admin concept exists in this snapshot.** `Users` has no `isAdmin` field, and there's no admin-gated route anywhere — user lookups (`GET /users/{id}`, `GET /users/by-username/{username}`) are fully public and return any user's `id`/`username` to anyone.
- **Debug `print()` calls ship in `fetch_report` and `get_transactions`.** Harmless, but they'll spam stdout in production logs.
- **`docker-compose.yml`'s named volume path may not align with the SQLite file's actual location** — worth verifying where the `.db` file actually lands relative to the mount.

---

*Generated to reflect the codebase exactly as provided — no planned/future functionality assumed.*
