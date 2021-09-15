import mongoose from 'mongoose'
import postModel from '../models/post.js'
import subjectModel from '../models/subject.js'
import userModel from '../models/user.js'
import likeModel from '../models/likeTable.js'
import dislikeModel from '../models/dislikeTable.js'

export const getAllPosts = async (req, res) => {
    try{
        const posts = await postModel.find().sort({createdAt: 'desc'});

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const getActivePosts = async (req, res) => {
    try{
        const posts = await postModel.find({active: true}).sort({createdAt: 'desc'});

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const createPost = async (req, res) => {
    const postBody = req.body;

    const newPost = new postModel(postBody);

    try{
        //Check for user and subject validity
        const foundUser = await userModel.findById(newPost.reviewer);
        const foundSubject = await subjectModel.findById(newPost.reviewedSubject)

        if(foundUser == null && foundSubject == null){
            res.status(409).json({ message: "There is no user or subject to be assigned." });
        }        
        else{
            //Check for user's same subject review
            const dupReview = await postModel.find({ reviewer: newPost.reviewer, reviewedSubject: newPost.reviewedSubject });
            if(dupReview.length === 0) {
                await newPost.save();
                res.status(201).json(newPost);
            }
            else if(dupReview.grade_received == 'F'){
                await newPost.save();
                res.status(201).json(newPost);
            }
            else{
                res.status(409).json({ message: "You have already reviewed this subject." })
            }
        }
    }
    catch(err){
        res.status(409).json({ message: err.message })
    }
}

export const getPostById = async (req, res) => {
    try{
        const post = await postModel.findById(req.params.postId);

        if(post == null){
            res.status(404).json();
        }

        res.status(200).json(post);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const updatePost = async (req, res) => {
    const { postId: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id.');

    //TODOS - Data Validation

    const updatedPost = await postModel.findByIdAndUpdate(_id, { ... post, _id}, { new: true });

    res.json(updatedPost);
}

export const likePost = async (req, res) => {
    const { postId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(409).send('Invalid ID format.');
    try{
        //Check for validity
        const post = await postModel.findById(postId);
        if(post == null){
            res.status(404).json('Post not found.');
        }
        else{
            //Check if post is liked or not
            const foundLike = await likeModel.findOne({ like_entity: postId, like_owner: req.user.id})
            if(foundLike == null){
                const newLike = await likeModel.create({
                    like_entity: postId,
                    like_owner: req.user.id,
                    entityModel: 'review'
                })
                res.status(201).json(newLike);
            }
            else{
                //If liked -> undo the like and same for the other
                const updatedLike = await likeModel.findByIdAndUpdate(foundLike.id, { active: !foundLike.active }, { new: true });

                //If the result is liking the entity
                if (updatedLike.active == true) {
                    //Check for dislike and disable it
                    const foundDislike = await dislikeModel.findOne({ dislike_entity: postId, dislike_owner: req.user.id });
                    if (foundDislike != null) {
                        await dislikeModel.findByIdAndUpdate(foundDislike.id, { active: false }, { new: true })
                    }
                }
                res.status(200).json(updatedLike);
            }
        }
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const dislikePost = async (req, res) => {
    const { postId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(409).send('Invalid ID format.');
    try{
        //Check for validity
        const post = await postModel.findById(postId);
        if(post == null){
            res.status(404).json('Post not found.');
        }
        else{
            //Check if post is liked or not
            const foundDislike = await dislikeModel.findOne({ dislike_entity: postId, dislike_owner: req.user.id})
            if(foundDislike == null){
                const newDislike = await dislikeModel.create({
                    dislike_entity: postId,
                    dislike_owner: req.user.id,
                    entityModel: 'review'
                })
                res.status(201).json(newDislike);
            }
            else{
                //If liked -> undo the like and same for the other
                const updatedDislike = await dislikeModel.findByIdAndUpdate(foundDislike.id, { active: !foundDislike.active }, { new: true });
                //If the result is disliking the entity
                if(updatedDislike.active == true){
                    //Check for like and disable it
                    const foundLike = await likeModel.findOne({ like_entity: postId, like_owner: req.user.id });
                    if (foundLike != null) {
                        await likeModel.findByIdAndUpdate(foundLike.id, { active: false }, { new: true })
                    }
                }
                res.status(200).json(updatedDislike);
            }
        }
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const getPostBySubject = async (req, res) => {
    const { subject: _subject } = req.params;
    
    try{
        const subjectId = await subjectModel.findOne({subject_abbr: _subject})
        const posts = await postModel.find({ reviewedSubject: subjectId }).sort({createdAt: 'desc'});

        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}

export const softDeletePost = async (req, res) => {
    const { postId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id.');

    const updatedPost = await postModel.findByIdAndUpdate(postId, { active: false }, { new: true });

    res.json(updatedPost);    
}

export const getPostsByUserId = async (req, res) => {
    const { userId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('No user with that id.');

    const updatedPost = await postModel.find({reviewer: userId});

    res.json(updatedPost);    
}