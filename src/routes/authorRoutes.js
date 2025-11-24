import express from 'express';
import {
	getAllAuthorsHandler,
	createAuthorHandler,
	updateAuthorHandler,
	deleteAuthorHandler,
	getAuthorByIdHandler,
} from '../controllers/authorController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
	validateCreateAuthor,
	validateUpdateAuthor,
	validateIds,
} from '../middleware/contentValidators.js';

const router = express.Router();

router.get('/', authenticate, getAllAuthorsHandler);

router.get('/:id', authenticate, validateIds, getAuthorByIdHandler);

//admin only routes

router.post('/', authenticate, authorizeRoles('admin'), validateCreateAuthor, createAuthorHandler);

router.put('/:id', authenticate, authorizeRoles('admin'), validateIds, validateUpdateAuthor, updateAuthorHandler);

router.delete('/:id', authenticate, authorizeRoles('admin'), validateIds, deleteAuthorHandler);

export default router;