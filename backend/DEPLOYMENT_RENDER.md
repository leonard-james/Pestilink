# Deploy the Laravel API to Render

The API can run on Render as a Docker web service with Render PostgreSQL. The
database migrations support PostgreSQL, including the application's views and
audit/notification triggers.

## Create the Render web service

1. Push this repository to GitHub and create a Render **Web Service** from it.
2. Set the root directory to `backend`.
3. Choose **Docker** as the runtime and set the Dockerfile path to
   `./Dockerfile` (relative to the `backend` root directory).
4. Set the health check path to `/up`.
5. Add these environment variables in Render:

   | Key | Value |
   | --- | --- |
   | `APP_ENV` | `production` |
   | `APP_DEBUG` | `false` |
   | `APP_KEY` | Fresh key generated with `php artisan key:generate --show`; keep it secret |
   | `APP_URL` | The deployed Render service URL, including `https://` |
   | `DB_CONNECTION` | `pgsql` |
   | `DB_HOST` | Internal hostname from the Render PostgreSQL database |
   | `DB_PORT` | `5432` |
   | `DB_DATABASE` | Database name from Render |
   | `DB_USERNAME` | Username from Render |
   | `DB_PASSWORD` | Password from Render |
   | `CORS_ALLOWED_ORIGINS` | Frontend origin, e.g. `https://your-site.vercel.app` |
   | `LOG_CHANNEL` | `stderr` |
   | `CACHE_STORE` | `file` |
   | `SESSION_DRIVER` | `file` |
   | `QUEUE_CONNECTION` | `sync` |

   Set `CORS_ALLOWED_ORIGINS` to the exact deployed frontend origin (scheme and
   host only). For multiple frontend origins, separate them with commas. Do not
   put database credentials or other secrets in frontend environment variables.

## Run database migrations

Create a PostgreSQL database in the same Render workspace and region as the
web service, then copy its **internal** connection details into the web
service's environment variables. Choose the Free database plan only for a
temporary demo: Render's free PostgreSQL databases expire 30 days after
creation. Free web services can spin down when idle, so the first request after
idle may be delayed. Confirm Render's current free-plan limits before
deploying; do not add a payment method or select a paid plan if you require a
strict $0 deployment.

After configuring the database, run `php artisan migrate --force` once against
the database's external connection. Render's Free web services don't provide
Shell access, so run the command from this project on your computer with the
database's external `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and
`DB_PASSWORD` temporarily set in your local environment. Your local PHP must
have `pdo_pgsql` enabled. Remove those temporary values afterward. Never run
`migrate:fresh` against production.

The Render database starts empty; local MySQL users and other records are not
copied automatically. Create a new account after the migrations complete, or
plan and verify a separate data migration if you need to retain existing data.

Do not run the development `AdminSeeder` in production without first replacing
its default credentials with a secure, unique admin password.

## Configure the frontend

Set `NEXT_PUBLIC_API_URL` on Vercel or Netlify to the deployed API origin, for
example `https://your-api.onrender.com`, then redeploy the frontend.

## Notes

- The container listens on Render's `PORT` and serves Laravel's `public`
  directory through Apache.
- Render's local container filesystem is ephemeral. Use Cloudinary or another
  external object store for persistent uploads.
- Use a production PostgreSQL provider with backups and network access controls.
