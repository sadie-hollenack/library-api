import express from 'express';
import { getAllReviewsHandler, createReviewHandler, updateReviewHandler, deleteReviewHandler, getReviewByIdHandler} from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getAllReviewsHandler);

router.get('/:id', getReviewByIdHandler);

router.post('/', createReviewHandler);

router.put('/:id', updateReviewHandler);

router.delete('/:id', deleteReviewHandler);

export default router;