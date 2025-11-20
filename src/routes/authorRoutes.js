import express from 'express';
import { getAllAuthorsHandler, createAuthorHandler, updateAuthorHandler, deleteAuthorHandler, getAuthorByIdHandler} from '../controllers/authorController.js';

const router = express.Router();

router.get('/', getAllAuthorsHandler);

router.get('/:id', getAuthorByIdHandler);

router.post('/', createAuthorHandler);

router.put('/:id', updateAuthorHandler);

router.delete('/:id', deleteAuthorHandler);

export default router;