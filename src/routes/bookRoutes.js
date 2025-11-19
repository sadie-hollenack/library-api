import express from 'express';
import { getAllBooksHandler, createBookHandler, updateBookHandler, deleteBookHandler, getBookByIdHandler} from '../controllers/bookController.js';

const router = express.Router();

router.get('/', getAllBooksHandler);

router.get('/:id', getBookByIdHandler);

router.post('/', createBookHandler);

router.put('/:id', updateBookHandler);

router.delete('/:id', deleteBookHandler);

export default router;