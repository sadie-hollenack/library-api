import express from 'express';
import { getAllUsersHandler, getUserByIDHandler, updateUserHandler, deleteUserHandler, updateUserRoleHandler } from '../controllers/userController.js';
import {signUpHandler, loginHandler } from '../controllers/authController.js';
//import { authenticate } from '../middleware/authenticate.js';
//import { authorizeRoles } from '../middleware/authorizeRoles.js';
//import { validateUpdateUser, roleValidator } from '../middleware/userValidators.js';

const router = express.Router();

router.get('/', getAllUsersHandler);
router.get('/:id', getUserByIDHandler);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);
router.patch('/:id/role', updateUserRoleHandler);
router.post('/signup', signUpHandler);
router.post('/login', loginHandler);

export default router;