import express from 'express'
import checkAuthorize from '../_helpers/checkAuthorize.js'
import Role from '../_helpers/role.js'

import { createUser, findUserById, getAllUsers, updateUser, getCurrentUser } from '../controllers/users.js'

const router = express.Router();

router.get('/', checkAuthorize(Role.Admin), getAllUsers);
router.get('/current', checkAuthorize(), getCurrentUser);
router.get('/:userId', checkAuthorize(Role.Admin), findUserById);
// router.put('/:id', updateUser);

export default router;