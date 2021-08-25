import mongoose from 'mongoose'
import subjectModel from '../models/subject.js'
import postModel from '../models/post.js'

export const getAllSubjects = async (req, res) => {
    try{
        const subjects = await subjectModel.find();

        res.status(200).json(subjects);
    }
    catch (err){
        res.status(404).json({ message: err.message });
    }
}

export const addSubject = async (req, res) => {
    const subjectBody = req.body;

    const newSubject = new subjectModel(subjectBody);

    try{
        await newSubject.save();

        res.status(201).json(newSubject);
    }
    catch(err){
        res.status(409).json({ message: err.message });
    }
}

export const updateSubject = async (req, res) => {
    const { subject: subject } = req.params;
    const subjectContent = req.body;
    try{
        const updatedSubject = await subjectModel.findOneAndUpdate({ subject_abbr: subject }, { ... subjectContent}, { new: true })
        res.json(updatedSubject);
        res.json(subjectId);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}

export const getSubjectInfo = async (req , res) => {
    const { subject: _subject } = req.params;

    try{
        const foundSubject = await subjectModel.findOne({ subject_abbr: _subject });
        
        res.status(200).json(foundSubject);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}