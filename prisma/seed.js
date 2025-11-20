import prisma from "../src/config/db.js";
import { UserRoles } from "../src/generated/prisma/index.js";

async function main() {
  // User
  const user1 = await prisma.user.create({
    data: {
      username: "booklover32",
      password: "password123",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "awesomesauce56",
      password: "strongpassword321",
    },
  });

  const admin1 = await prisma.user.create({
    data: {
      username: "admin1",
      password: "1nimda",
      role: UserRoles.admin,
    },
  });
  // Author
  const author1 = await prisma.author.create({
    data: {
      name: "George Orwell",
      biography: "British writer and journalist",
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: "William Shakespeare",
      biography: "English playwright, poet and actor",
    },
  });
  // Books
  const book1 = await prisma.book.create({
    data: {
      title: "Animal Farm",
      published_year: 1949,
      genre: "Dystopian Fiction",
      author_id: author1.author_id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "1984",
      published_year: 1949,
      genre: "Dystopian Fiction",
      author_id: author1.author_id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      title: "Hamlet",
      published_year: 1603,
      genre: "Tragedy",
      author_id: author2.author_id,
    },
  });

  // Reviews
  const review1 = await prisma.review.create({
    data: {
      title: "Not Enough Animals",
      content: "Great book, i just wish there was a zebra or something",
      rating: 4,
      book_id: book1.book_id,
      user_id: user1.user_id,
    },
  });

  const review2 = await prisma.review.create({
    data: {
      title: "This is NOT how i remember 1984",
      content: "1984 was a great year and this book got NOTHING right about it",
      rating: 1,
      book_id: book2.book_id,
      user_id: user2.user_id,
    },
  });

  const review3 = await prisma.review.create({
    data: {
      title: "Shakespeare has done it again",
      content: "Absolute Cinema, i wish he didnt die at the end tho",
      rating: 5,
      book_id: book3.book_id,
      user_id: user2.user_id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
