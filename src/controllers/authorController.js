import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from '../services/authorService.js';

export async function getAllAuthorsHandler(req, res) {
  const {
    search,
    sortBy = 'author_id',
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

  let result = await getAllAuthors(filter);
  res.status(200).json(result);
}

export async function getAuthorByIdHandler(req, res) {
  let id = parseInt(req.params.id);
  let author = await getAuthorById(id);
  res.status(200).json(author);
}

export async function createAuthorHandler(req, res) {
  const data = {
    name: req.body.name,
    biography: req.body.biography,
  };
  let newAuthor = await createAuthor(data);
  res.status(201).json(newAuthor);
}

export async function updateAuthorHandler(req, res) {
  let id = parseInt(req.params.id);
  const updates = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.biography) updates.biography = req.body.biography;

  const updatedAuthor = await updateAuthor(id, updates);
  res.status(200).json(updatedAuthor);
}

export async function deleteAuthorHandler(req, res) {
  let id = parseInt(req.params.id);
  await deleteAuthor(id);
  res.status(204).send();
}