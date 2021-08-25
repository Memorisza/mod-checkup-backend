import express from 'express'
import { addNewComment, editComment, getCommentById, softDeleteComment } from '../controllers/comments.js';

const router = express.Router();

router.post('/', addNewComment);
router.get('/:commentId', getCommentById);
router.put('/:commentId', editComment);
router.delete('/:commentId', softDeleteComment);

export default router;