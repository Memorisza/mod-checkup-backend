import express from 'express'
import { getPostBySubject } from '../controllers/posts.js';
import { getAllSubjects, addSubject, updateSubject, getSubjectInfo} from '../controllers/subjects.js'
import checkAuthorize from '../_helpers/checkAuthorize.js'
import Role from '../_helpers/role.js'

const router = express.Router();

//Everyone Access
router.get('/', getAllSubjects);
router.get('/:subject', getSubjectInfo);
router.get('/:subject/posts', getPostBySubject);

//Teacher & Admin Access
router.post('/', checkAuthorize(Role.Admin, Role.Teacher), addSubject);
router.put('/:subject', checkAuthorize(Role.Admin, Role.Teacher), updateSubject);



export default router;