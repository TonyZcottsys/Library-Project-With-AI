# Deploy Mini Library

Choose one: **Vercel** (if it works for you) or **Render** (free alternative, recommended below).

---

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

---

# Deploy with Render (free alternative)

[Render](https://render.com) offers a **free tier** for both web services and PostgreSQL. The app may spin down after ~15 minutes of inactivity (free tier); the first request after that can take 30–60 seconds to wake up.

## 1. Push to GitHub

Same as above: push your project to a GitHub repo (see **Section 1**).

## 2. Production database on Render

1. Go to https://render.com and sign in (e.g. with GitHub).
2. **New +** → **PostgreSQL**.
3. Create a database (e.g. name: `library-db`), choose **Free** plan, region closest to you.
4. After creation, open the database → **Info** tab → copy **Internal Database URL** (use this for env var on Render so the app and DB are in the same region).

Run migrations once from your machine (replace with your Render Postgres URL):

```bash
# Windows (PowerShell): $env:DATABASE_URL="postgresql://..."
# Windows (CMD): set DATABASE_URL=postgresql://...
# Mac/Linux: export DATABASE_URL="postgresql://..."
npx prisma migrate deploy
npm run prisma:seed
```

Or put the **External Database URL** from Render’s Connect tab in your local `.env` as `DATABASE_URL` and run the same commands.

## 3. Deploy the Next.js app on Render

1. **New +** → **Web Service**.
2. Connect your GitHub repo and select the Library repo.
3. Configure:
   - **Name:** e.g. `mini-library`
   - **Region:** same as your PostgreSQL (e.g. Oregon).
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm run start`
   - **Instance Type:** **Free**

4. **Environment** – add variables (use **Add Environment Variable**):

   | Name                  | Value |
   |-----------------------|--------|
   | `DATABASE_URL`        | Your Render Postgres **Internal Database URL** (from the DB’s Info tab) |
   | `NEXTAUTH_SECRET`     | Long random string (e.g. `openssl rand -base64 32`) |
   | `NEXTAUTH_URL`        | `https://YOUR-SERVICE-NAME.onrender.com` (replace with your Render URL; you can set it after first deploy) |
   | `GOOGLE_CLIENT_ID`    | Your Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET`| Your Google OAuth client secret |
   | `SEED_ADMIN_EMAIL`    | (optional) Email for ADMIN role |
   | `SEED_LIBRARIAN_EMAIL`| (optional) Email for LIBRARIAN role |

5. Click **Create Web Service**. Render will build and deploy. After the first deploy, copy the live URL (e.g. `https://mini-library-xxxx.onrender.com`), set **NEXTAUTH_URL** to that URL in the Render dashboard, and **Save** (Render will redeploy).

## 4. Google OAuth for production

In **Google Cloud Console** → APIs & Services → Credentials → your OAuth 2.0 Client:

1. Under **Authorized redirect URIs** add:
   - `https://YOUR-SERVICE-NAME.onrender.com/api/auth/callback/google`
2. Save.

Use the same Client ID and Client Secret in Render’s environment variables.

## 5. Optional: other free options

- **Railway** (https://railway.app): Free $5/month credit; add a PostgreSQL service and deploy from GitHub. Good if you prefer Railway’s UX.
- **Fly.io** (https://fly.io): Free tier; you deploy with `fly launch` and can add a Postgres volume. More command-line focused.
- **Neon + static host:** Use Neon (or Supabase) for Postgres and host the frontend on **Cloudflare Pages** or **Netlify** with Next.js; for a full Next.js API + server rendering, Render or Railway is simpler.
