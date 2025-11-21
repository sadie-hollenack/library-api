//uncomment when config/db.js is setup
import prisma from '../config/db.js';

export async function getAll(filter) {
  const conditions = {};

  if (filter.search) {
    conditions.OR = [
      { title: { contains: filter.search, mode: 'insensitive' } },
      { published_year: { contains: filter.search, mode: 'insensitive' } },
      { genre: { contains: filter.search, mode: 'insensitive' } },
      { author_id: { contains: filter.search, mode: 'insensitive' } },
    ];
  }

  const books = await prisma.book.findMany({
    where: conditions,
    select: {
      book_id: true,
      title: true,
      published_year: true,
      genre: true,
      author_id: true,   
    },
    orderBy: { [filter.sortBy]: filter.sortOrder },
    take: filter.limit,
    skip: filter.offset,
  });

  return books;
}

export async function getById(id) {
  const book = await prisma.book.findUnique({
    where: { id },
    select: {
      book_id: true,
      title: true,
      published_year: true,
      genre: true,
      author_id: true,  
    },
  });
  return book;
}

export async function create(book) {
  const newBook = await prisma.book.create({
    data: book,
  });
  return newBook;
}

export async function update(id, updates) {
  try {
    const updatedBook = await prisma.book.update({
      where: { id },
      data: updates,
    });
    return updatedBook;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedBook = await prisma.book.delete({
      where: { id },
    });
    return deletedBook;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}