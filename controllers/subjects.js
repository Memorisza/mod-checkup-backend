import mongoose from 'mongoose'
import subjectMessage from '../models/subject.js'

export const getSubjects = async (req, res) => {
    try{
        const subjects = await subjectMessage.find();

        res.status(200).json(subjects);
    }
    catch (err){
        res.status(404).json({ message: err.message });
    }
}

export const addSubject = async (req, res) => {
    const subjectBody = req.body;

    const newSubject = new subjectMessage(subjectBody);

    try{
        await newSubject.save();

        res.status(201).json(newSubject);
    }
    catch(err){
        res.status(409).json({ message: err.message })
    }
}

export const viewSubject = async (req, res) => {
    const { subject: _subject } = req.params;
    try{
        const subject = await subjectMessage.find({ subject_abbr: _subject });

        res.status(200).json(subject);
    }
    catch(err){
        res.status(404).json({ message: err.message })
    }
}

export const updateSubject = async (req, res) => {
    const { subject: subject } = req.params;
    const subjectContent = req.body;
    try{
        const subjectId = convertAbbrToId(subject);
        const updatedSubject = await subjectMessage.findByIdAndUpdate(subjectId, { ... subjectContent, subjectId}, { new: true });
        res.json(updatedSubject);
        res.json(subjectId);
    }
    catch(err){
        res.status(404).json({ message: err.message })
    }    
}

const convertAbbrToId = async ( _abbr ) => {
    try{
        const subject = await subjectMessage.findOne({ subject_abbr: _abbr });
        return subject._id;
        // console.log(_abbr);
        // console.log(subject._id);
        // console.log(typeof subject._id);
        // console.log(foundId instanceof mongoose.Types.ObjectId)
    }
    catch(err){
        console.log(err.message);
    }
}