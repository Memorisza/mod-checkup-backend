var mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
    owner_name:{
        type: String,
        required: true,
    },
    owner_email:{
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