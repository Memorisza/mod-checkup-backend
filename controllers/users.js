import mongoose from 'mongoose'
import sanitize from 'mongo-sanitize';
import userModel from '../models/user.js'

export const getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find();

        res.status(200).json(users);
    }
    catch (err){
        res.status(404).json({ message: err.message });
    }
}

export const createUser = async (req, res) => {
    const userBody = sanitize(req.body);

    const newUser = new userModel(userBody);

    try{
        await newUser.save();

        res.status(201).json(newUser);
    }
    catch(err){
        res.status(409).json({ message: err.message })
    }
}

export const findUserById = async (req, res) => {
    try{
        const user = await userModel.findById(req.params.userId);
        if(!user){
            res.status(404).json();
        }
        res.status(200).json(user);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const findUserByGoogleId = async (req, res) => {
    try{
        const user = await userModel.findOne({ google_id: req.params.google_id });
        if(!user){
            res.status(404).json();
        }
        res.status(200).json(user);
    }
    catch(err){
        res.status(404).json({ message: err.message });
    }
}

export const updateUser = async (req, res) => {
    const { id } = sanitize(req.params);
    const user = sanitize(req.body);

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with that id.');

    try{
        const updatedUser = await userModel.findByIdAndUpdate(id, { ... user, id}, { new: true });
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(409).json({ message: err.message })
    }    
}

export const getCurrentUser = async (req, res) => {
    res.send(req.user);
}