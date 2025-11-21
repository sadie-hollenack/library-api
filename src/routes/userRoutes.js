import express from 'express';
import { getAllUsersHandler, getUserByIDHandler, updateUserHandler, deleteUserHandler, updateUserRoleHandler } from '../controllers/userController.js';
import {signUpHandler, loginHandler } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authorizeOwner } from '../middleware/authorizeOwnership.js';
import {
    validateSignup,
    validateLogin,
    validateUpdateUser,
    validateRoleUpdate
} from "../middleware/userValidators.js";

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getAllUsersHandler);
router.get('/:id', authenticate, authorizeOwner, getUserByIDHandler);
router.put('/:id', 
    authenticate,
    authorizeOwner,
    validateUpdateUser,
    updateUserHandler);
router.delete('/:id', 
    authenticate,
    authorizeOwner,
    deleteUserHandler);
router.patch('/:id/role', 
    authenticate,
    authorizeRoles('admin'),
    validateRoleUpdate,
    updateUserRoleHandler);
router.post('/signup', validateSignup, signUpHandler);
router.post('/login', validateLogin, loginHandler);

export default router;