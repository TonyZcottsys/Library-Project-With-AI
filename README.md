# Mini Library Management System

A small library app where users sign in with **email/password** or **Google** and get different permissions based on their role: **Admin**, **Librarian**, or **Member**. You can browse books, borrow and return them, and (as staff) add or manage the catalog.

---

## How to Use the App

### Signing in

You can sign in in two ways:

**Email and password (seeded accounts)**  
After running the database seed, three test accounts are available:

| Role      | Email                     | Password       |
|-----------|---------------------------|----------------|
| Member    | `member@library.local`    | `Member123!`   |
| Librarian | `librarian@library.local` | `Librarian123!` |
| Admin     | `admin@library.local`     | `Admin123!`    |

Use these on the sign-in page with "Sign in with email".

**Google**  
1. Click **Continue with Google** and choose your Google account.  
2. Your **role** (Admin, Librarian, or Member) is determined by the **email** of that account in the database (see [Switching between Admin and Librarian](#switching-between-admin-and-librarian) below).

### What you can do by role

| Action | Member | Librarian | Admin |
|--------|--------|-----------|--------|
| Browse books | ✅ | ✅ | ✅ |
| Check out a book | ✅ | ✅ | ✅ |
| Return a book | ✅ | ✅ | ✅ |
| View borrow history | ✅ | ✅ | ✅ |
| Add a new book | ❌ | ✅ | ✅ |
| Edit a book | ❌ | ❌ | ✅ |
| Delete a book | ❌ | ❌ | ✅ |
| View Admin analytics | ❌ | ❌ | ✅ |

- **Dashboard** – Overview (total books, active borrows, most borrowed). Quick links to Books and Borrow history.
- **Books** – Search and filter, then check out, or (if allowed) add, edit, or delete books.
- **Borrow history** – List of your borrows; return books that are still “Borrowed.”
- **Admin analytics** – Only for Admin: same metrics as the dashboard in one place.

---

## Switching Between Admin and Librarian

The app assigns roles by **email**. To use **Admin** or **Librarian**, you need to sign in with a Google account whose email is set to that role in the database.

### Option 1: Use the seeded emails (recommended for trying the app)

1. In the project root, copy `.env.example` to `.env` and fill in your values.
2. Set which Google accounts should be Admin and Librarian:
   ```env
   SEED_ADMIN_EMAIL="your-admin@gmail.com"
   SEED_LIBRARIAN_EMAIL="your-librarian@gmail.com"
   ```
   Use real Gmail addresses you can sign in with.

3. Seed the database so those emails get the right roles:
   ```bash
   npm run prisma:seed
   ```

4. **Sign out** if you’re already signed in (e.g. open `/api/auth/signout` or use Sign out in the app).

5. **Sign in again** with the account you want:
   - Sign in with **your-admin@gmail.com** → you’ll have **Admin** (add, edit, delete books + Admin analytics).
   - Sign in with **your-librarian@gmail.com** → you’ll have **Librarian** (add books, no edit/delete, no Admin analytics).

So: **switch accounts by signing out and signing in with the other Google account** (admin vs librarian email). The sidebar will show “Role: ADMIN” or “Role: LIBRARIAN” so you can confirm.

### Option 2: Change who is Admin or Librarian

1. Update `.env`:
   ```env
   SEED_ADMIN_EMAIL="new-admin@gmail.com"
   SEED_LIBRARIAN_EMAIL="new-librarian@gmail.com"
   ```
2. Run the seed again:
   ```bash
   npm run prisma:seed
   ```
3. Sign out and sign in with the new admin or librarian email.

---

## Running the App Locally

1. **Prerequisites:** Node.js 18+, PostgreSQL (e.g. Docker: `docker run -d --name library-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`).

2. **Install and env:**
   ```bash
   npm install
   cp .env.example .env
   ```
   Edit `.env`: set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (e.g. `http://localhost:3000`), and Google OAuth `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. Optionally set `SEED_ADMIN_EMAIL` and `SEED_LIBRARIAN_EMAIL`.

3. **Database:**
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed
   ```

4. **Run:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and sign in with Google.

For deployment (e.g. Vercel + hosted Postgres), see **DEPLOY.md**.
