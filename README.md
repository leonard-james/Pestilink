# Pestilink

Pestilink is a web platform that helps farmers identify pests, learn prevention and treatment options, and book local pest-control services. Companies can list services tagged to specific pests, and admins oversee users, bookings, and reports.

**Tagline:** Solve your pest problems in one tap.

## Features

- **Pest library** — 31 pests with biology, signs, prevention, treatment, and DIY tips
- **Service marketplace** — company services tagged to pests and bookable from pest or service pages
- **Role-based dashboards**
  - **Farmer** — browse pests/services, book jobs, track orders
  - **Company** — manage services and booking status
  - **Admin** — users, orders, reports, and settings
- **Auth** — register as farmer or company; login via Laravel Sanctum tokens
- **Notifications** — booking-related alerts in the UI
- **About** — team and product background

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Laravel 12, PHP 8.2+, Laravel Sanctum |
| Database | MySQL (`pestilink`) |
| Media | Cloudinary (optional, for pest image upload) |

## Project structure

```
Pestilink/
├── frontend/     # Next.js website (localhost:3000)
├── backend/      # Laravel API (localhost:8000)
└── package.json  # convenience scripts that proxy to frontend
```

## Prerequisites

- Node.js 18+ and npm
- PHP 8.2+ and Composer
- MySQL 8 (default port `3306`)

## Getting started

### 1. Backend API

```bash
cd backend
composer install
copy .env.example .env   # Windows; use cp on macOS/Linux
php artisan key:generate
```

In `backend/.env`, point at MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pestilink
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the database, then migrate and seed:

```sql
CREATE DATABASE IF NOT EXISTS pestilink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
php artisan migrate
php artisan db:seed --class=AdminSeeder
php artisan serve
```

The API runs at [http://localhost:8000](http://localhost:8000). Seeded admin accounts are listed in [`SETUP_COMPLETE.md`](SETUP_COMPLETE.md).

Optional: set Cloudinary variables in `backend/.env` if you use pest image upload.

### 2. Frontend website

```bash
cd frontend
npm install
```

Create `frontend/.env.local` if the API is not on the default host:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). From the repo root you can also run `npm run dev` (it proxies into `frontend`).

If you see `'next' is not recognized`, run `npm install` inside `frontend` first.

## Main routes

| Path | Description |
| --- | --- |
| `/` | Landing page |
| `/login`, `/signup` | Authentication |
| `/home` | Redirects signed-in users to their dashboard |
| `/pest-services` | Pest management hub |
| `/pest-services/pests` | Pest library |
| `/services` | Public service listings |
| `/products` | Service catalog and ordering |
| `/dashboard/farmer` | Farmer dashboard |
| `/dashboard/company` | Company dashboard |
| `/company/services`, `/company/orders` | Company tools |
| `/admin` | Admin dashboard |
| `/about` | About the team |

## API overview

Public:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/services`
- `GET /api/services/suggest?pest={name}`

Authenticated (Bearer token):

- `GET /api/auth/profile`, `POST /api/auth/logout`
- Bookings: `POST /api/bookings`, `GET /api/bookings/me`, `GET /api/bookings/company`, `PATCH /api/bookings/{id}/status`
- Notifications: `GET /api/notifications`
- Company services: `GET/POST /api/company/services`

More detail: [`backend/API_AUTHENTICATION.md`](backend/API_AUTHENTICATION.md) and [`SETUP_COMPLETE.md`](SETUP_COMPLETE.md).

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `'next' is not recognized` | `cd frontend && npm install` |
| Frontend cannot reach API | Confirm `php artisan serve` is running and `NEXT_PUBLIC_API_URL` is correct |
| MySQL connection failed | Start the MySQL service and match `DB_*` values in `backend/.env` |
| Views/triggers missing | Use MySQL, not SQLite, then re-run migrations |

## License

Private student project. Frontend and backend folders still contain the default Next.js and Laravel READMEs from those frameworks.
