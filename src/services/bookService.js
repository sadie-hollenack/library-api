import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../respositories/bookRepo.js';

export async function getAllBooks(filter) {
  return await getAll(filter);
}

export async function getBookById(id) {
  let result = await getById(id);
  if (result) return result;
  else {
    const error = new Error(`Cannot find book with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function createBook(data) {
  return await create(data);
}

export async function updateBook(id, data) {
  const updatedBook = await update(id, data);
  if (updatedBook) return updatedBook;
  else {
    const error = new Error(`Cannot find book with id ${id}`);
    error.status = 404;
    throw error;
  }
}

export async function deleteBook(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`Cannot find book with id ${id}`);
    error.status = 404;
    throw error;
  }
}