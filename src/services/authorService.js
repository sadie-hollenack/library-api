import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../respositories/authorRepo.js';

export async function getAllAuthors(filter) {
  return await getAll(filter);
}

export async function getAuthorById(id) {
  let result = await getById(id);
  if (result) return result;
  else {
    const error = new Error(`Cannot find author with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function createAuthor(data) {
  return await create(data);
}

export async function updateAuthor(id, data) {
  const updatedAuthor = await update(id, data);
  if (updatedAuthor) return updatedAuthor;
  else {
    const error = new Error(`Cannot find author with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function deleteAuthor(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Cannot find author with id ${id}`);
    error.status = 404;
    throw error;
  }
}
