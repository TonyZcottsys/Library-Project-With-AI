# Deploy Mini Library to GitHub + Vercel

## 1. Push to GitHub

In the project folder (where `package.json` is), run:

```bash
git init
git add .
git commit -m "Initial commit: Mini Library Management System"
```

Create a new repository on GitHub (https://github.com/new):
- Name it e.g. `mini-library` or `library-lms`
- Do **not** add a README, .gitignore, or license (you already have .gitignore)
- Copy the “remote” URL (e.g. `https://github.com/YOUR_USERNAME/mini-library.git`)

Then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 2. Production database

The app uses PostgreSQL. For production use a hosted Postgres:

- **Neon** (free tier): https://neon.tech → create project → copy connection string
- **Supabase** (free tier): https://supabase.com → Project Settings → Database → connection string
- **Railway**: https://railway.app → New → PostgreSQL → copy `DATABASE_URL`

Run migrations against the **production** URL once (from your machine or a one-off script):

```bash
# Set production DB URL then:
npx prisma migrate deploy
# Optional: seed admin user (set SEED_ADMIN_EMAIL in env first)
npm run prisma:seed
```

---

## 3. Host the app on Vercel

1. Go to https://vercel.com and sign in (e.g. with GitHub).
2. **Add New** → **Project** → import your GitHub repo.
3. **Environment variables** – add these (use your production values):

   | Name               | Value (example) |
   |--------------------|-----------------|
   | `DATABASE_URL`     | Your production Postgres URL |
   | `NEXTAUTH_SECRET`  | Long random string (e.g. `openssl rand -base64 32`) |
   | `NEXTAUTH_URL`     | `https://your-app.vercel.app` (replace with your Vercel URL after first deploy) |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
   | `SEED_ADMIN_EMAIL` | (optional) Email to get ADMIN role |

4. Deploy. Vercel will run `next build` and host the app.
5. After the first deploy, set **NEXTAUTH_URL** to the real URL (e.g. `https://mini-library-xxx.vercel.app`) and redeploy if needed.

---

## 4. Google OAuth for production

In Google Cloud Console (APIs & Services → Credentials):

1. Open your OAuth 2.0 Client ID.
2. Under **Authorized redirect URIs** add:
   - `https://YOUR_VERCEL_DOMAIN.vercel.app/api/auth/callback/google`
3. Save.

Use the same client’s Client ID and Client Secret in Vercel env vars.

---

## 5. Optional: custom domain

In the Vercel project: **Settings** → **Domains** → add your domain and follow the DNS instructions. Then set `NEXTAUTH_URL` to that domain.
