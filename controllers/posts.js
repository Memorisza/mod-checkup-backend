import mongoose from 'mongoose'
import csvtojson from 'csvtojson'
import csv from 'csv-express'

import postModel from '../models/post.js'
import subjectModel from '../models/subject.js'
import userModel from '../models/user.js'
import likeModel from '../models/likeTable.js'
import dislikeModel from '../models/dislikeTable.js'

export const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.find().sort({ createdAt: 'desc' });

        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getActivePosts = async (req, res) => {
    try {
        const posts = await postModel.find({ active: true })
        .populate('reviewedSubject', 'subject_abbr subject_name')
        .sort({ createdAt: 'desc' });

        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const createPost = async (req, res) => {
    const postBody = req.body;

    const newPost = new postModel(postBody);

    try {
        //Check for user and subject validity
        const foundUser = await userModel.findById(newPost.reviewer);
        const foundSubject = await subjectModel.findById(newPost.reviewedSubject)

        if (foundUser == null && foundSubject == null) {
            res.status(409).json({ message: "There is no user or subject to be assigned." });
        }
        //Force create (For testing)
        else if(newPost.force == true){
            await newPost.save();
            res.status(201).json(newPost);
        }
        else {
            //Check for user's same subject review
            const dupReview = await postModel.find({ reviewer: newPost.reviewer, reviewedSubject: newPost.reviewedSubject, active: true });
            if (dupReview.length === 0) {
                await newPost.save();
                res.status(201).json(newPost);
            }
            else {
                let passCount = 0;
                dupReview.forEach(tempReview => {
                    //Check if passed
                    if (!(tempReview.grade_received == 'F' || tempReview.grade_received == 'W')) {
                        passCount++;
                    }
                });
                //If the reviewer has passed the subject and reviewed it already
                if(passCount > 0){
                    res.status(409).json({ message: "You have already reviewed this subject." })
                }
                else{
                    await newPost.save();
                    res.status(201).json(newPost);
                }
            }            
        }
    }
    catch (err) {
        res.status(409).json({ message: err.message })
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.postId).populate('reviewedSubject', 'subject_abbr subject_name');

        if (post == null) {
            res.status(404).json();
        }

        res.status(200).json(post);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const newPost = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id.');

    //Check data validity
    try{
        const foundUser = await userModel.findById(newPost.reviewer);
        const foundSubject = await subjectModel.findById(newPost.reviewedSubject);
        if (foundUser == null && foundSubject == null) {
            res.status(409).json({ message: "There is no user or subject to be assigned." });
        }
        else{
            const updatedPost = await postModel.findByIdAndUpdate(postId, { ... newPost, postId }, { new: true });
            res.status(200).json(updatedPost);
        }
    }
    catch(err){
        res.status(409).json({ message: err.message });
    }    
}

export const likePost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(409).send('Invalid ID format.');
    try {
        //Check for validity
        const post = await postModel.findById(postId);
        if (post == null) {
            res.status(404).json('Post not found.');
        }
        else {
            //Check if post is liked or not
            const foundLike = await likeModel.findOne({ like_entity: postId, like_owner: req.user.id })
            if (foundLike == null) {
                const newLike = await likeModel.create({
                    like_entity: postId,
                    like_owner: req.user.id,
                    entityModel: 'review'
                })
                //Check for dislike and disable it
                const foundDislike = await dislikeModel.findOne({ dislike_entity: postId, dislike_owner: req.user.id });
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
                    const foundDislike = await dislikeModel.findOne({ dislike_entity: postId, dislike_owner: req.user.id });
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

export const dislikePost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(409).send('Invalid ID format.');
    try {
        //Check for validity
        const post = await postModel.findById(postId);
        if (post == null) {
            res.status(404).json('Post not found.');
        }
        else {
            //Check if post is liked or not
            const foundDislike = await dislikeModel.findOne({ dislike_entity: postId, dislike_owner: req.user.id })
            if (foundDislike == null) {
                const newDislike = await dislikeModel.create({
                    dislike_entity: postId,
                    dislike_owner: req.user.id,
                    entityModel: 'review'
                })
                //Check for like and disable it
                const foundLike = await likeModel.findOne({ like_entity: postId, like_owner: req.user.id });
                if (foundLike != null) {
                    await likeModel.findByIdAndUpdate(foundLike.id, { active: false }, { new: true })
                }
                res.status(201).json(newDislike);
            }
            else {
                //If liked -> undo the like and same for the other
                const updatedDislike = await dislikeModel.findByIdAndUpdate(foundDislike.id, { active: !foundDislike.active }, { new: true });
                //If the result is disliking the entity
                if (updatedDislike.active == true) {
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
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getPostBySubject = async (req, res) => {
    const { subject: _subject } = req.params;

    try {
        const subjectId = await subjectModel.findOne({ subject_abbr: _subject })
        const posts = await postModel.find({ reviewedSubject: subjectId, active:true })
                                            .populate('reviewedSubject', 'subject_abbr subject_name')
                                            .sort({ createdAt: 'desc' });

        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const softDeletePost = async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id.');

    const updatedPost = await postModel.findByIdAndUpdate(postId, { active: false }, { new: true });

    res.json(updatedPost);
}

export const getPostsByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('No user with that id.');

    const updatedPost = await postModel.find({ reviewer: userId, active: true })
    .populate('reviewedSubject', 'subject_abbr subject_name')
    .sort({ createdAt: 'desc' });

    res.json(updatedPost);
}

export const importCsvFile = async (req, res) => {
    const csvFile = req.files.csvFile;
    try{
        const jsonObj = await csvtojson().fromFile(csvFile.tempFilePath);
        const importedPosts = postModel.insertMany(jsonObj);
        res.status(201).json(importedPosts);
    }
    catch(err){
        res.status(409).json({ message: err.message });
    }
}

export const exportCsvFile = async (req, res) => {
    //const Param = req.params;
    try {
        const foundPosts = await postModel.find().sort({ createdAt: 'desc' }).lean().exec();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=test.csv');
        res.csv(foundPosts, true)
    } 
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const getActivePostsByPage = async (req, res) => {
    let { pageNo, pageSize } = req.params;
    pageNo = parseInt(pageNo);
    pageSize = parseInt(pageSize);
    if(pageNo <= 0){
        pageNo = 1
    }
    if(pageSize <= 0){
        pageSize = 10
    }
    try{
        const foundPage = await postModel.find({ active: true })
        .populate('reviewedSubject', 'subject_abbr subject_name')
        .sort({ createdAt: 'desc' })
        .skip(pageSize * (pageNo - 1))
        .limit(pageSize)
        res.status(200).json(foundPage)
    }
    catch (err){
        res.status(409).json({ message: err.message });
    }
}

export const getActivePostsBySubjectAndPage = async (req, res) => {
    const { subject } = req.params;
    let { pageNo, pageSize } = req.params;
    pageNo = parseInt(pageNo);
    pageSize = parseInt(pageSize);
    if(pageNo <= 0){
        pageNo = 1
    }
    if(pageSize <= 0){
        pageSize = 10
    }
    try {
        const subjectId = await subjectModel.findOne({ subject_abbr: subject })
        const posts = await postModel.find({ reviewedSubject: subjectId, active:true })
                                            .populate('reviewedSubject', 'subject_abbr subject_name')
                                            .sort({ createdAt: 'desc' })
                                            .skip(pageSize * (pageNo - 1))
                                            .limit(pageSize);

        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}