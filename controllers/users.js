import mongoose from 'mongoose'
import userModel from '../models/user.js'

export const getAllUsers = async (req, res) => {
    try{
        const subjects = await userModel.find();

        res.status(200).json(subjects);
    }
    catch (err){
        res.status(404).json({ message: err.message });
    }
}

export const createUser = async (req, res) => {
    const userBody = req.body;

    const newUser = new userModel(userBody);

    try{
        await newUser.save();

        res.status(201).json(newUser);
    }
    catch(err){
        console.log(err.message);
        res.status(409).json({ message: err.message })
    }
}

export const findUserById = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.id);

        res.status(200).json(user);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const findUserByGoogleId = async (req, res) => {
    try{
        const user = await userModel.findOne({ google_id: req.params.google_id });

        res.status(200).json(user);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const updateUser = async (req, res) => {
    const { id: _id } = req.params;
    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No user with that id.');

    const updatedUser = await userModel.findByIdAndUpdate(_id, { ... user, _id}, { new: true });

    res.json(updatedUser);
}