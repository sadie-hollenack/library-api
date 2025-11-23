import { param, query, body, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';
import prisma from '../config/db.js';

export const validateIds = [
    param('id')
    .isInt({min:0})
    .withMessage('ID must be 0 or positive int'),
    handleValidationErrors,
];

// AUTHOR VALIDATORS
export const validateCreateAuthor = [
    body('name')
    .exists({values:"falsy"})
    .withMessage("Name required")
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters'),

    body('biography')
    .exists({ values: 'falsy' })
    .withMessage('biography is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('biography must be a string')
    .bail()
    .isLength({ min: 10 })
    .withMessage('biography must be at least 10 characters'),

  handleValidationErrors,
];

export const validateUpdateAuthor = [
  oneOf([
    body('name').exists({ values:"falsy" }),
    body('biography').exists({ values:"falsy" }),
  ], 'At least one field (name, biography) must be provided'),

  body('name')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters'),

  body('biography')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('biography must be a string')
    .bail()
    .isLength({ min: 10 })
    .withMessage('biography must be at least 10 characters'),

  handleValidationErrors,
];

//TODO: review validators. test them

// BOOK VALIDATORS
export const validateCreateBook = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('title is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .isLength({ min: 1 })
    .withMessage('title must be at least 1 character'),

  body('published_year')
    .optional()
    .isInt({ min: 0, max: 9999 })
    .withMessage('published_year must be a valid year'),

  body('genre')
    .exists({ checkFalsy: true })
    .withMessage('genre is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('genre must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('genre must be at least 3 characters'),

  body('author_id')
    .exists({ checkFalsy: true })
    .withMessage('author_id is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('author_id must be a positive integer')
    .bail()
    .custom(async (val) => {
      const id = parseInt(val, 10);
      const author = await prisma.author.findUnique({ where: { author_id: id } });
      if (!author) throw new Error('author_id must exist');
      return true;
    }),

  handleValidationErrors,
];

export const validateUpdateBook = [
  oneOf([
    body('title').exists({ checkFalsy: true }),
    body('published_year').exists({ checkFalsy: true }),
    body('genre').exists({ checkFalsy: true }),
    body('author_id').exists({ checkFalsy: true }),
  ], 'At least one field (title, published_year, genre, author_id) must be provided'),

  body('title')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .isLength({ min: 1 })
    .withMessage('title must be at least 1 character'),

  body('published_year')
    .optional()
    .isInt({ min: 0, max: 9999 })
    .withMessage('published_year must be a valid year'),

  body('genre')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('genre must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('genre must be at least 3 characters'),

  body('author_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('author_id must be a positive integer')
    .bail()
    .custom(async (val) => {
      const id = parseInt(val, 10);
      const author = await prisma.author.findUnique({ where: { author_id: id } });
      if (!author) throw new Error('author_id must exist');
      return true;
    }),

  handleValidationErrors,
];

// REVIEW VALIDATORS
export const validateCreateReview = [
  body('title')
    .exists({ checkFalsy: true })
    .withMessage('title is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .isLength({ min: 1 })
    .withMessage('title must be at least 1 character'),

  body('content')
    .exists({ checkFalsy: true })
    .withMessage('content is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('content must be a string')
    .bail()
    .isLength({ min: 10 })
    .withMessage('content must be at least 10 characters'),

  body('rating')
    .exists({ checkFalsy: true })
    .withMessage('rating is required')
    .bail()
    .isInt({ min: 1, max: 5 })
    .withMessage('rating must be an integer between 1 and 5'),

  body('book_id')
    .exists({ checkFalsy: true })
    .withMessage('book_id is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('book_id must be a positive integer')
    .bail()
    .custom(async (val) => {
      const id = parseInt(val, 10);
      const book = await prisma.book.findUnique({ where: { book_id: id } });
      if (!book) throw new Error('book_id must exist');
      return true;
    }),

  handleValidationErrors,
];

export const validateUpdateReview = [
  oneOf([
    body('title').exists({ checkFalsy: true }),
    body('content').exists({ checkFalsy: true }),
    body('rating').exists({ checkFalsy: true }),
  ], 'At least one field (title, content, rating) must be provided'),

  body('title')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('title must be a string')
    .bail()
    .isLength({ min: 1 })
    .withMessage('title must be at least 1 character'),

  body('content')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('content must be a string')
    .bail()
    .isLength({ min: 10 })
    .withMessage('content must be at least 10 characters'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('rating must be an integer between 1 and 5'),

  handleValidationErrors,
];
