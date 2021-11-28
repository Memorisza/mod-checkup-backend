import express from 'express'
import checkAuthorize from '../_helpers/checkAuthorize.js'
import Role from '../_helpers/role.js'

import { findUserById, getAllUsers, updateUser, getCurrentUser, setCurrentUserToStudent, setCurrentUserToTeacher } from '../controllers/users.js'

const router = express.Router();

router.get('/', checkAuthorize(Role.Admin), getAllUsers);
router.get('/current', checkAuthorize(), getCurrentUser);
router.get('/:userId', checkAuthorize(Role.Admin), findUserById);
router.put('/:id/student', checkAuthorize(), setCurrentUserToStudent);
router.put('/:id/teacher', checkAuthorize(), setCurrentUserToTeacher);

//Will be eliminated before putting in production?
router.put('/:id', checkAuthorize(Role.Admin) , updateUser);

export default router;