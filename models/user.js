import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
    google_id:{
        type: String,
        required: true,
    },
    owner_role:{
        type: String,
        required: true,
    }
},{
        timestamp: true,
});

const userMessage = mongoose.model('user', userSchema);

export default userMessage;