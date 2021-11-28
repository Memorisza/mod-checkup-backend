import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
    googleId: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'STUDENT', 'TEACHER', 'RESEARCHER'],
    }
}, {
    timestamp: true,
});

const userMessage = mongoose.model('user', userSchema);

export default userMessage;