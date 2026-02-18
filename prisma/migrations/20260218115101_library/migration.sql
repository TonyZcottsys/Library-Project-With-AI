-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "BorrowRecord_userId_bookId_borrowed_unique";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- AlterTable
ALTER TABLE "AiRecommendation" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "BorrowRecord" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
