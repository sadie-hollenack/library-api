import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../respositories/reviewRepo.js';

export async function getAllReviews(filter) {
  return await getAll(filter);
}

export async function getReviewById(id) {
  let result = await getById(id);
  if (result) return result;
  else {
    const error = new Error(`Cannot find review with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function createReview(data) {
  return await create(data);
}

export async function updateReview(id, data) {
  const updatedReview = await update(id, data);
  if (updatedReview) return updatedReview;
  else {
    const error = new Error(`Cannot find review with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function deleteReview(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Cannot find review with id ${id}`);
    error.status = 404;
    throw error;
  }
}