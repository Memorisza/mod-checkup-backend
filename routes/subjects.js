import express from 'express'

import { getAllSubjects, addSubject, viewSubject, updateSubject, getSubjectAllInfoAndPosts} from '../controllers/subjects.js'

const router = express.Router();

// Old Routing
// router.get('/', getSubjects);
// router.post('/', addSubject);
// router.get('/:subject', viewSubject);
// router.put('/:subject', updateSubject);

router.get('/', getAllSubjects);
router.post('/', addSubject);
router.get('/:subject', getSubjectAllInfoAndPosts);
router.put('/:subject', updateSubject);


export default router;