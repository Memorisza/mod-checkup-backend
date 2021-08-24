import express from 'express'

import { createUser, findUserById, getAllUsers, updateUser } from '../controllers/users.js'

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', findUserById);
// router.put('/:id', updateUser);

export default router;