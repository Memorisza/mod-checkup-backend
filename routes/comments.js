import express from 'express'
import { addNewComment, editComment, getCommentById, softDeleteComment, likeComment, dislikeComment, getActiveCommentsByPostId, getActiveCommentsByPostIdAndPage, exportCsvFile, importCsvFile, getCommentRatingCount } from '../controllers/comments.js';
import checkAuthorize from '../_helpers/checkAuthorize.js'
import Role from '../_helpers/role.js'

const router = express.Router();

//Everyone Access
router.get('/:commentId', getCommentById);
router.get('/post/:postId', getActiveCommentsByPostId);
router.get('/post/:postId/page/:pageNo/size/:pageSize', getActiveCommentsByPostIdAndPage)
router.get('/rating_count/:commentId', getCommentRatingCount);

//Require Login
router.post('/', checkAuthorize(), addNewComment);
router.put('/:commentId', checkAuthorize(), editComment);
router.delete('/:commentId', checkAuthorize(), softDeleteComment);
router.patch('/:commentId/like', checkAuthorize(), likeComment);
router.patch('/:commentId/dislike', checkAuthorize(), dislikeComment);

//Researcher Access
router.get('/csv/export', checkAuthorize(Role.Admin,Role.Researcher), exportCsvFile);

//Admin Access
router.post('/csv/import', checkAuthorize(Role.Admin) , importCsvFile);


export default router;