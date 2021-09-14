import express from 'express'
import checkAuthorize from '../_helpers/checkAuthorize.js'

import { createUser, findUserById, getAllUsers, updateUser, getCurrentUser } from '../controllers/users.js'

const router = express.Router();

router.get('/', getAllUsers);
router.get('/current', checkAuthorize(), getCurrentUser);
router.get('/:userId', findUserById);
// router.put('/:id', updateUser);

export default router;