import { param, query, body, oneOf} from 'express-validator';
import {handleValidationErrors} from './handleValidationErrors.js';

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