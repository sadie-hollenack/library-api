import express from 'express';
import {
	getAllBooksHandler,
	createBookHandler,
	updateBookHandler,
	deleteBookHandler,
	getBookByIdHandler,
} from '../controllers/bookController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
	validateCreateBook,
	validateUpdateBook,
	validateIds,
} from '../middleware/contentValidators.js';

const router = express.Router();

// Require authentication for all book endpoints
router.get('/', authenticate, getAllBooksHandler);

router.get('/:id', authenticate, validateIds, getBookByIdHandler);

// Admin-only for create/update/delete
router.post('/', authenticate, authorizeRoles('admin'), validateCreateBook, createBookHandler);

router.put('/:id', authenticate, authorizeRoles('admin'), validateIds, validateUpdateBook, updateBookHandler);

router.delete('/:id', authenticate, authorizeRoles('admin'), validateIds, deleteBookHandler);

export default router;