import express from 'express'

import { getSubjects, addSubject, viewSubject, updateSubject, getSubjectName } from '../controllers/subjects.js'

const router = express.Router();

router.get('/', getSubjects);
router.post('/add', addSubject);
router.get('/:subject', viewSubject);
router.get('/s/:id', getSubjectName);
router.put('/:subject', updateSubject);

export default router;