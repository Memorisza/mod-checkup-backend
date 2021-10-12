import commentModel from '../models/comment.js'
import likeModel from '../models/likeTable.js'
import dislikeModel from '../models/dislikeTable.js'
import postModel from '../models/post.js'
import userModel from '../models/user.js'
import mongoose from 'mongoose'

export const getActiveCommentsByPostId = async (req, res) => {
    const { postId } = req.params

    try {
        const foundComments = await commentModel.find({ basePost: postId, active: true }).sort({ createdAt: 'desc' })

        res.status(200).json(foundComments);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getCommentById = async (req, res) => {
    const { commentId } = req.params;
    try {
        const foundComment = await commentModel.findById(commentId);

        if (!foundComment) {
            res.status(404).json();
        }

        res.status(200).json(foundComment);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const addNewComment = async (req, res) => {
    const commentBody = req.body;

    const newComment = new commentModel(commentBody)
    try {
        const foundUser = await userModel.findById(newComment.commenter);
        const foundPost = await postModel.findById(newComment.basePost);
        if (foundUser != null && foundPost != null) {
            await newComment.save();
            res.status(201).json(newComment);
        }
        else {
            res.status(409).json({ message: "Invalid ID" })
        }
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

export const editComment = async (req, res) => {
    const { commentId } = req.params
    const newComment = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send('No comment with that id.');
    
    try{
        const foundUser = await userModel.findById(newComment.commenter);
        const foundPost = await postModel.findById(newComment.basePost);
        if (foundUser != null && foundPost != null) {
            res.status(409).json({ message: "Invalid Input" })
        }
        else{
            const updatedComment = await commentModel.findByIdAndUpdate(commentId, { ...commentContent, commentId }, { new: true });
            res.status(200).json(updatedComment);
        }
        
    }
    catch(err){
        res.status(409).json({ message: err.message })
    }

    
}

export const softDeleteComment = async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(404).send('No comment with that id.');

    const updatedComment = await commentModel.findByIdAndUpdate(commentId, { active: false }, { new: true });

    res.json(updatedComment);
}

export const likeComment = async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(409).send('Invalid ID format.');
    try {
        //Check for comment's validity
        const foundComment = await commentModel.findById(commentId);
        if (foundComment == null) {
            res.status(404).json('Comment not found.');
        }
        else {
            //Check if the comment is liked or not
            const foundLike = await likeModel.findOne({ like_entity: commentId, like_owner: req.user.id });
            if (foundLike == null) {
                const newLike = await likeModel.create({
                    like_entity: commentId,
                    like_owner: req.user.id,
                    entityModel: 'comment'
                })
                //Check for dislike and disable it
                const foundDislike = await dislikeModel.findOne({ dislike_entity: commentId, dislike_owner: req.user.id });
                if (foundDislike != null) {
                    await dislikeModel.findByIdAndUpdate(foundDislike.id, { active: false }, { new: true })
                }
                res.status(201).json(newLike);
            }
            else {
                //If liked -> undo the like and same for the other
                const updatedLike = await likeModel.findByIdAndUpdate(foundLike.id, { active: !foundLike.active }, { new: true });

                //If the result is liking the entity
                if (updatedLike.active == true) {
                    //Check for dislike and disable it
                    const foundDislike = await dislikeModel.findOne({ dislike_entity: commentId, dislike_owner: req.user.id });
                    if (foundDislike != null) {
                        await dislikeModel.findByIdAndUpdate(foundDislike.id, { active: false }, { new: true })
                    }
                }
                res.status(200).json(updatedLike);
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const dislikeComment = async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(409).send('Invalid ID format.');
    try {
        //Check for validity
        const post = await commentModel.findById(commentId);
        if (post == null) {
            res.status(404).json('Post not found.');
        }
        else {
            //Check if post is liked or not
            const foundDislike = await dislikeModel.findOne({ dislike_entity: commentId, dislike_owner: req.user.id })
            if (foundDislike == null) {
                const newDislike = await dislikeModel.create({
                    dislike_entity: commentId,
                    dislike_owner: req.user.id,
                    entityModel: 'comment'
                })
                //Check for like and disable it
                const foundLike = await likeModel.findOne({ like_entity: commentId, like_owner: req.user.id });
                if (foundLike != null) {
                    await likeModel.findByIdAndUpdate(foundLike.id, { active: false }, { new: true })
                }
                res.status(201).json(newDislike);
            }
            else {
                //If liked -> undo the like and same for the other
                const updatedDislike = await dislikeModel.findByIdAndUpdate(foundDislike.id, { active: !foundDislike.active }, { new: true });

                //If the result is disliking the entity
                if(updatedDislike.active == true){
                    //Check for like and disable it
                    const foundLike = await likeModel.findOne({ like_entity: commentId, like_owner: req.user.id });
                    if (foundLike != null) {
                        await likeModel.findByIdAndUpdate(foundLike.id, { active: false }, { new: true })
                    }
                }
                res.status(200).json(updatedDislike);
            }
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getActiveCommentsByPostIdAndPage = async (req, res) => {
    const { postId } = req.params
    let { pageNo, pageSize } = req.params
    pageNo = parseInt(pageNo);
    pageSize = parseInt(pageSize);
    try {
        const foundComments = await commentModel.find({ basePost: postId, active: true })
                                                .sort({ createdAt: 'desc' })
                                                .skip(pageSize * (pageNo - 1))
                                                .limit(pageSize);

        res.status(200).json(foundComments);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}