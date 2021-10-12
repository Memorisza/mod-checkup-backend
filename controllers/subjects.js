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

        const dupSubjectAbbr = await subjectModel.find({ subject_abbr: newSubject.subject_abbr, active: true });
        const dupSubjectName = await subjectModel.find({ subject_name: newSubject.subject_name, active: true });
        
        if(dupSubjectAbbr.length == 0 && dupSubjectName.length == 0){
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
        res.status(200).json(updatedSubject);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}

export const getSubjectInfo = async (req , res) => {
    const { subject: _subject } = req.params;

    try{
        const foundSubject = await subjectModel.findOne({ subject_abbr: _subject });
        if(foundSubject == null){
            res.status(404).json();
        }
        res.status(200).json(foundSubject);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }    
}

export const getAllActiveSubjects = async (req, res) => {
    try{
        const subjects = await subjectModel.find({ active:true })
                                           .sort({ subject_abbr: 1 });

        res.status(200).json(subjects);
    }
    catch (err){
        res.status(404).json({ message: err.message });
    }
}

export const getAllActiveSubjectsByPage = async (req, res) => {
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
        const subjects = await subjectModel.find({ active: true })
                                           .sort({ subject_abbr: 1 })
                                           .skip(pageSize * (pageNo - 1))
                                           .limit(pageSize);

        res.status(200).json(subjects);
    }
    catch (err){
        res.status(404).json({ message: err.message });
    }
}