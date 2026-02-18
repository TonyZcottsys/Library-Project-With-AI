// @ts-nocheck
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const sampleBooks = [
  {
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian novel about surveillance, truth, and power in a totalitarian state.",
    isbn: "9780451524935",
    category: "Fiction",
    publishedYear: 1949,
    totalCopies: 5,
    availableCopies: 5
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    description:
      "A practical guide to programming craftsmanship, habits, and maintainable software.",
    isbn: "9780201616224",
    category: "Software",
    publishedYear: 1999,
    totalCopies: 4,
    availableCopies: 4
  },
  {
    title: "Leaders Eat Last",
    author: "Simon Sinek",
    description:
      "Explores leadership cultures that create trust, safety, and long-term performance.",
    isbn: "9781591845328",
    category: "Leadership",
    publishedYear: 2014,
    totalCopies: 3,
    availableCopies: 3
  }
];

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const librarianEmail = process.env.SEED_LIBRARIAN_EMAIL;

  if (adminEmail) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN" },
      create: { email: adminEmail, role: "ADMIN", name: "Admin" }
    });
  }

  if (librarianEmail) {
    await prisma.user.upsert({
      where: { email: librarianEmail },
      update: { role: "LIBRARIAN" },
      create: { email: librarianEmail, role: "LIBRARIAN", name: "Librarian" }
    });
  }

  const existing = await prisma.book.count();
  if (existing === 0) {
    await prisma.book.createMany({ data: sampleBooks });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

