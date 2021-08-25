import express from 'express'
import { getPostBySubject } from '../controllers/posts.js';

import { getAllSubjects, addSubject, updateSubject, getSubjectInfo} from '../controllers/subjects.js'

const router = express.Router();

// Old Routing
// router.get('/', getSubjects);
// router.post('/', addSubject);
// router.get('/:subject', viewSubject);
// router.put('/:subject', updateSubject);

router.get('/', getAllSubjects);
router.post('/', addSubject);
router.get('/:subject', getSubjectInfo);
router.put('/:subject', updateSubject);
router.get('/:subject/posts', getPostBySubject);


export default router;