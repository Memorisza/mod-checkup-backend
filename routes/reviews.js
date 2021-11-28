import express from 'express'
import { getActiveCommentsByPostId } from '../controllers/comments.js';
import { createPost, getPostById, updatePost, likePost, dislikePost, softDeletePost, getActivePosts, getPostsByUserId, importCsvFile, exportCsvFile, getActivePostsByPage } from '../controllers/posts.js'
import checkAuthorize from '../_helpers/checkAuthorize.js'
import Role from '../_helpers/role.js'

const router = express.Router();

//Everyone Access
router.get('/', getActivePosts);
router.get('/:postId', getPostById);
router.get('/:postId/comments', getActiveCommentsByPostId);
router.get('/page/:pageNo/size/:pageSize', getActivePostsByPage);

//Student Access
router.post('/', checkAuthorize(Role.Student), createPost);
router.put('/:postId', checkAuthorize(Role.Student), updatePost);
router.patch('/:postId/like', checkAuthorize(Role.Student), likePost);
router.patch('/:postId/dislike', checkAuthorize(Role.Student), dislikePost);
router.delete('/:postId', checkAuthorize(Role.Student), softDeletePost);
router.get('/history/:userId', checkAuthorize(Role.Student), getPostsByUserId);

//Researcher Access
router.get('/csv/export', checkAuthorize(Role.Admin,Role.Researcher), exportCsvFile);

//Admin Only Access
router.post('/csv/import', checkAuthorize(Role.Admin) , importCsvFile);


export default router;
