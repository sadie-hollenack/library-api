import { param, body, oneOf} from 'express-validator';
import {handleValidationErrors} from './handleValidationErrors.js';

export const validateSignup = [
    body('username')
    .exists({values: 'falsy'})
    .withMessage('username cannot be blank')
    .bail()
    .isString()
    .trim()
    .escape(),

    body('password')
    .exists({values: 'falsy'})
    .withMessage('password is required')
    .bail()
    .isLength({min:4, max: 16})
    .withMessage('password must be between 4-16 characters long'),

    handleValidationErrors,
];

export const validateLogin = [
    body('username')
    .exists({values: 'falsy'})
    .withMessage('invalid entry'),

    body('password')
    .exists({values: 'falsy'})
    .withMessage('invalid entry'),

    handleValidationErrors,
];

export const validateUpdateUser = [
    oneOf(
        [
            body('username')
            .exists({values: 'falsy'}),
            body('password')
            .exists({values: 'falsy'})
        ],
        { message: 'validation failed'}
    ),

    body('username')
    .optional()
    .isString()
    .trim()
    .escape(),

    handleValidationErrors,
];

export const validateRoleUpdate = [
    body('role')
    .exists({values: 'falsy'})
    .withMessage("role must be admin or member")
    .bail()
    .isIn(['admin', 'member'])
    .withMessage('role must be admin or member'),

    handleValidationErrors,
];