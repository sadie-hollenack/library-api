import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewService.js';

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
  const data = {
    title: req.body.title,
    content: req.body.content,
    rating: req.body.rating,
    book_id: req.body.book_id,
    user_id: req.user.user_id,
  };
  let newReview = await createReview(data);
  res.status(201).json(newReview);
}

export async function updateReviewHandler(req, res) {
  let id = parseInt(req.params.id);
  const updates = {};
  if (req.body.title) updates.title = req.body.title;
  if (req.body.content) updates.content = req.body.content;
  if (req.body.rating) updates.rating = req.body.rating;

  const updatedReview = await updateReview(id, updates);
  res.status(200).json(updatedReview);
}

export async function deleteReviewHandler(req, res) {
  let id = parseInt(req.params.id);
  await deleteReview(id);
  res.status(204).send();
}