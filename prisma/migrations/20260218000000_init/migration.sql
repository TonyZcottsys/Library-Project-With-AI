-- Initial schema for Mini Library Management System
-- Includes NextAuth (v4) tables and Library domain models.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "Role" AS ENUM ('ADMIN', 'LIBRARIAN', 'MEMBER');
CREATE TYPE "BorrowStatus" AS ENUM ('BORROWED', 'RETURNED');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT,
  "email" TEXT,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "role" "Role" NOT NULL DEFAULT 'MEMBER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider","providerAccountId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier","token");

CREATE TABLE "Book" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "isbn" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "publishedYear" INTEGER NOT NULL,
  "totalCopies" INTEGER NOT NULL,
  "availableCopies" INTEGER NOT NULL,
  "aiSummary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
CREATE INDEX "Book_category_idx" ON "Book"("category");
CREATE INDEX "Book_author_idx" ON "Book"("author");
CREATE INDEX "Book_title_idx" ON "Book"("title");

CREATE TABLE "BorrowRecord" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "bookId" UUID NOT NULL,
  "borrowDate" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "returnDate" TIMESTAMP(3),
  "status" "BorrowStatus" NOT NULL DEFAULT 'BORROWED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "BorrowRecord_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BorrowRecord_userId_status_idx" ON "BorrowRecord"("userId","status");
CREATE INDEX "BorrowRecord_bookId_status_idx" ON "BorrowRecord"("bookId","status");

-- Enforce “no double borrowing” at the database level:
-- a user can have at most one BORROWED record per book.
CREATE UNIQUE INDEX "BorrowRecord_userId_bookId_borrowed_unique"
ON "BorrowRecord"("userId","bookId")
WHERE "status" = 'BORROWED';

CREATE TABLE "AiRecommendation" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "request" JSONB NOT NULL,
  "response" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "AiRecommendation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiRecommendation_userId_createdAt_idx" ON "AiRecommendation"("userId","createdAt");

ALTER TABLE "Account"
  ADD CONSTRAINT "Account_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session"
  ADD CONSTRAINT "Session_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BorrowRecord"
  ADD CONSTRAINT "BorrowRecord_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "BorrowRecord"
  ADD CONSTRAINT "BorrowRecord_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AiRecommendation"
  ADD CONSTRAINT "AiRecommendation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Optional full-text search index (works without adding new columns):
-- Uses a GIN index over a derived tsvector.
CREATE INDEX "Book_search_gin" ON "Book" USING GIN (
  to_tsvector(
    'simple',
    coalesce("title",'') || ' ' ||
    coalesce("author",'') || ' ' ||
    coalesce("isbn",'') || ' ' ||
    coalesce("category",'') || ' ' ||
    coalesce("description",'')
  )
);

