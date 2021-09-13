import express from 'express'
import { addNewComment, editComment, getCommentById, softDeleteComment } from '../controllers/comments.js';
import checkAuthorize from '../_helpers/checkAuthorize.js'

const router = express.Router();

//Everyone Access
router.get('/:commentId', getCommentById);

//Require Login
router.post('/', checkAuthorize(), addNewComment);
router.put('/:commentId', checkAuthorize(), editComment);
router.delete('/:commentId', checkAuthorize(), softDeleteComment);

export default router;