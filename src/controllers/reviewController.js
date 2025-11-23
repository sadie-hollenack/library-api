import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewService.js';
import { getBookById } from '../services/bookService.js';

export async function getAllReviewsHandler(req, res) {
  const {
    search,
    sortBy = 'review_id',
    sortOrder = 'desc',
    limit = 10,
    offset = 0,
  } = req.query;

  const filter = {};
  if (search) filter.search = search;
  filter.sortBy = sortBy;
  filter.sortOrder = sortOrder;
  filter.limit = parseInt(limit);
  filter.offset = parseInt(offset);

  let result = await getAllReviews(filter);
  res.status(200).json(result);
}

export async function getReviewByIdHandler(req, res) {
  let id = parseInt(req.params.id);
  let review = await getReviewById(id);
  res.status(200).json(review);
}

export async function createReviewHandler(req, res) {

  const book = await getBookById(req.body.book_id);
  // validate user_id is integer to avoid errors
  const userId = parseInt(req.body.user_id, 10);
  if (Number.isNaN(userId) || userId > 2147483647 || userId < -2147483648) {
    return res.status(400).json({ error: 'Invalid user_id' });
  }
  // check user exists
  const { getUser } = await import('../services/userService.js');
  const user = await getUser(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const data = {
    title: book.title,
    content: req.body.content || req.body.comment,
    rating: req.body.rating,
    book_id: req.body.book_id,
    user_id: req.body.user_id,
  };
  let newReview = await createReview(data);
  res.status(201).json(newReview);
}

export async function updateReviewHandler(req, res) {
  let id = parseInt(req.params.id);
  const updates = {};
  if (req.body.title) updates.title = req.body.title;
  if (req.body.content) updates.content = req.body.content;
  if (req.body.comment) updates.content = req.body.comment;
  if (req.body.rating) updates.rating = req.body.rating;

  const updatedReview = await updateReview(id, updates);
  res.status(200).json(updatedReview);
}

export async function deleteReviewHandler(req, res) {
  let id = parseInt(req.params.id);
  await deleteReview(id);
  res.status(204).send();
}