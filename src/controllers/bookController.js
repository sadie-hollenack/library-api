import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../services/bookService.js';

export async function getAllBooksHandler(req, res) {
  const {
    search,
    sortBy = 'book_id',
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

  let result = await getAllBooks(filter);
  res.status(200).json(result);
}

export async function getBookByIdHandler(req, res) {
  let id = parseInt(req.params.id);
  let book = await getBookById(id);
  res.status(200).json(book);
}

export async function createBookHandler(req, res) {
  const data = {
    title: req.body.title,
    published_year: req.body.published_year,
    genre: req.body.genre,
    author_id: req.body.author_id,
  };
  let newBook = await createBook(data);
  res.status(201).json(newBook);
}

export async function updateBookHandler(req, res) {
  let id = parseInt(req.params.id);
  const updates = {};
  if (req.body.title) updates.title = req.body.title;
  if (req.body.published_year) updates.published_year = req.body.published_year;
  if (req.body.genre) updates.genre = req.body.genre;
  if (req.body.author_id) updates.author_id = req.body.author_id;

  const updatedBook = await updateBook(id, updates);
  res.status(200).json(updatedBook);
}

export async function deleteBookHandler(req, res) {
  let id = parseInt(req.params.id);
  await deleteBook(id);
  res.status(204).send();
}