//uncomment when config/db.js is setup
import prisma from '../config/db.js';

export async function getAll(filter) {
  const conditions = {};

  if (filter.search) {
    conditions.OR = [
      { title: { contains: filter.search, mode: 'insensitive' } },
      { content: { contains: filter.search, mode: 'insensitive' } },
      { rating: { contains: filter.search, mode: 'insensitive' } },
      { book_id: { contains: filter.search, mode: 'insensitive' } },
    ];
  }

  const reviews = await prisma.review.findMany({
    where: conditions,
    select: {
      review_id: true,
      title: true,
      content: true,
      rating: true,
      created_at: true,
      author_id: true,
      user_id: true,  
    },
    orderBy: { [filter.sortBy]: filter.sortOrder },
    take: filter.limit,
    skip: filter.offset,
  });

  return reviews;
}

export async function getById(id) {
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      review_id: true,
      title: true,
      content: true,
      rating: true,
      created_at: true,
      author_id: true,
      user_id: true, 
    },
  });
  return review;
}

export async function create(review) {
  const newReview = await prisma.review.create({
    data: review,
  });
  return newReview;
}

export async function update(id, updates) {
  try {
    const updatedReview = await prisma.review.update({
      where: { id },
      data: updates,
    });
    return updatedReview;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedReview = await prisma.review.delete({
      where: { id },
    });
    return deletedReview;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}