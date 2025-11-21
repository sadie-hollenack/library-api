//uncomment when config/db.js is setup
//import prisma from '../config/db.js';

export async function getAll(filter) {
  const conditions = {};

  if (filter.search) {
    conditions.OR = [
      { name: { contains: filter.search, mode: 'insensitive' } },
      { biography: { contains: filter.search, mode: 'insensitive' } },
    ];
  }

  const authors = await prisma.author.findMany({
    where: conditions,
    select: {
      author_id: true,
      name: true,
      biography: true,   
    },
    orderBy: { [filter.sortBy]: filter.sortOrder },
    take: filter.limit,
    skip: filter.offset,
  });

  return authors;
}

export async function getById(id) {
  const author = await prisma.author.findUnique({
    where: { author_id: id },
    select: {
      author_id: true,
      name: true,
      biography: true,  
    },
  });
  return author;
}

export async function create(author) {
  const newAuthor = await prisma.author.create({
    data: author,
  });
  return newAuthor;
}

export async function update(id, updates) {
  try {
    const updatedAuthor = await prisma.author.update({
      where: { author_id: id },
      data: updates,
    });
    return updatedAuthor;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedAuthor = await prisma.author.delete({
      where: { author_id: id },
    });
    return deletedAuthor;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
