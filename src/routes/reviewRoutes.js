import express from 'express';
import {
	getAllReviewsHandler,
	createReviewHandler,
	updateReviewHandler,
	deleteReviewHandler,
	getReviewByIdHandler,
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { ensureReviewOwner, ensureReviewOwnerOrAdmin } from '../middleware/authorizeOwnership.js';
import { checkRatingPrivilege } from '../middleware/reviewAuthChecks.js';
import {
	validateCreateReview,
	validateUpdateReview,
	validateIds,
} from '../middleware/contentValidators.js';

const router = express.Router();

// Require authentication for all review endpoints
router.get('/', authenticate, getAllReviewsHandler);

router.get('/:id', authenticate, validateIds, getReviewByIdHandler);

router.post('/', authenticate, validateCreateReview, createReviewHandler);

// updating is for the review owner only (authorize before validation)
router.put('/:id', authenticate, validateIds, checkRatingPrivilege, validateUpdateReview, updateReviewHandler);

// owner or admin can delete reviews
router.delete('/:id', authenticate, validateIds, ensureReviewOwnerOrAdmin, deleteReviewHandler);

export default router;