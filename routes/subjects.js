import express from 'express'

import { getAllSubjects, addSubject, viewSubject, updateSubject} from '../controllers/subjects.js'

import { getPostBySubject } from '../controllers/posts.js';

const router = express.Router();

// Old Routing
// router.get('/', getSubjects);
// router.post('/add', addSubject);
// router.get('/:subject', viewSubject);
// router.put('/:subject', updateSubject);

router.get('/', getAllSubjects);
router.get('/:subject', getPostBySubject);

export default router;