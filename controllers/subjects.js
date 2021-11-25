import mongoose from 'mongoose'
import sanitize from 'mongo-sanitize'
import csvtojson from 'csvtojson'
import csv from 'csv-express'
import subjectModel from '../models/subject.js'
import postModel from '../models/post.js'

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await subjectModel.find();

        res.status(200).json(subjects);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const addSubject = async (req, res) => {
    const subjectBody = sanitize(req.body);

    const newSubject = new subjectModel(subjectBody);

    try {

        const dupSubjectAbbr = await subjectModel.find({ subject_abbr: newSubject.subject_abbr, active: true });
        const dupSubjectName = await subjectModel.find({ subject_name: newSubject.subject_name, active: true });

        if (dupSubjectAbbr.length == 0 && dupSubjectName.length == 0) {
            await newSubject.save();
            res.status(201).json(newSubject);
        }
        else {
            res.status(409).json({ message: "The entity is already existed." });
        }
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const updateSubject = async (req, res) => {
    const { subject } = sanitize(req.params);
    const subjectContent = sanitize(req.body);
    try {
        const updatedSubject = await subjectModel.findOneAndUpdate({ subject_abbr: subject }, { ...subjectContent }, { new: true })
        res.status(200).json(updatedSubject);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getSubjectInfo = async (req, res) => {
    const { subject } = sanitize(req.params);

    try {
        const foundSubject = await subjectModel.findOne({ subject_abbr: subject });
        if (foundSubject == null) {
            return res.status(404).json();
        }
        const avgData = await postModel.aggregate()
            .match({ reviewedSubject: foundSubject._id })
            .group({
                _id: foundSubject._id,
                teacher_avg: { $avg: '$teacher_rating' },
                useful_avg: { $avg: '$usefulness_rating' },
                parti_avg: { $avg: '$participation_rating' }
            })
            .addFields({
                t_rounded: { $round: ["$teacher_avg", 1] },
                u_rounded: { $round: ["$useful_avg", 1] },
                p_rounded: { $round: ["$parti_avg", 1] }
            });
        console.log(avgData)
        if (avgData == null) {
            return res.status(500).json();
        }
        const wrapper = {
            active: foundSubject.active,
            _id: foundSubject._id,
            subject_abbr: foundSubject.subject_abbr,
            subject_name: foundSubject.subject_name,
            createdAt: foundSubject.createdAt,
            updatedAt: foundSubject.updatedAt,
            __v: foundSubject.__v,
            teacher_avg: avgData[0].t_rounded,
            usefulness_avg: avgData[0].u_rounded,
            participation_avg: avgData[0].p_rounded
        }
        console.log(wrapper)
        res.status(200).json(wrapper);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getAllActiveSubjects = async (req, res) => {
    try {
        const subjects = await subjectModel.find({ active: true })
            .sort({ subject_abbr: 1 });

        res.status(200).json(subjects);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getAllActiveSubjectsByPage = async (req, res) => {
    let { pageNo, pageSize } = sanitize(req.params);
    pageNo = parseInt(pageNo);
    pageSize = parseInt(pageSize);
    if (pageNo <= 0) {
        pageNo = 1
    }
    if (pageSize <= 0) {
        pageSize = 10
    }
    try {
        const subjects = await subjectModel.find({ active: true })
            .sort({ subject_abbr: 1 })
            .skip(pageSize * (pageNo - 1))
            .limit(pageSize);

        res.status(200).json(subjects);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const searchSubjectByAbbr = async (req, res) => {
    const { subjectAbbr } = sanitize(req.params);
    try {
        const foundSubjectsAbbr = await subjectModel.find({ subject_abbr: subjectAbbr, active: true })
            .sort({ subject_abbr: 1 });
        res.status(200).json(foundSubjectsAbbr);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getAllSubjectsAverageRatings = async (req, res) => {
    try {
        let avgWrapper = [];
        const avgData = await postModel.aggregate()
            .match({ active: true })
            .group({
                _id: '$reviewedSubject',
                teacher_avg: { $avg: '$teacher_rating' },
                useful_avg: { $avg: '$usefulness_rating' },
                parti_avg: { $avg: '$participation_rating' }
            })
            .addFields({
                t_rounded: { $round: ["$teacher_avg", 1] },
                u_rounded: { $round: ["$useful_avg", 1] },
                p_rounded: { $round: ["$parti_avg", 1] }
            });
        if (avgData == null) {
            return res.status(500).json();
        }
        for (const tempRatings of avgData) {
            let foundSubject = await subjectModel.findById(tempRatings._id);
            let appendData = {
                subject_abbr: foundSubject.subject_abbr,
                subject_name: foundSubject.subject_name,
                teacher_avg: tempRatings.t_rounded,
                usefulness_avg: tempRatings.u_rounded,
                participation_avg: tempRatings.p_rounded
            }
            avgWrapper.push(appendData);
        }
        avgWrapper.sort(function (a, b) {
            if (a.subject_abbr < b.subject_abbr) {
                return -1;
            }
            if (a.subject_abbr > b.subject_abbr) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
        res.status(200).json(avgWrapper);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const importCsvFile = async (req, res) => {
    const csvFile = req.files.csvFile;
    let errCount = 0;
    let importedSubjects = [];
    const jsonObj = await csvtojson().fromFile(csvFile.tempFilePath);
    for (const post of jsonObj) {
        try{
            const createdSubject = await axios.post(config.BACK_APP_URL + '/api/subjects/', post);
            importedSubjects.push(createdSubject.data);
        }
        catch(err){
            errCount++;
            continue;
        }
    }
    importedSubjects.push({
        Total_Records: jsonObj.length,
        Records_inserted: jsonObj.length-errCount ,
        Records_error: errCount
    })
    res.status(201).json(importedSubjects);
}

export const exportCsvFile = async (req, res) => {
    //const Param = req.params;
    try {
        const foundSubjects = await subjectModel.find().sort({ createdAt: 'desc' }).lean().exec();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader("Content-Disposition", 'attachment; filename=mod-checkup-subjects.csv');
        res.csv(foundSubjects, true)
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
}