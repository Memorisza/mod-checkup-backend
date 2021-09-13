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

        const dupSubjectAbbr = subjectModel.find({ subject_abbr: newSubject.subject_abbr });
        const dupSubjectName = subjectModel.find({ subject_name: newSubject.subject_name });

        if(dupSubjectAbbr == null && dupSubjectName == null){
            await newSubject.save();
            res.status(201).json(newSubject);
        }      
        else{
            res.status(409).json({ message: "The entity is already existed."});
        }        
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