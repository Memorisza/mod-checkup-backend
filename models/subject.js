import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    _id:{
        type: String
    },
    subject_abbr: {
        type: String,
        required: true,
        unique: true
    },
    subject_name: {
        type: String,
        required: true,
        unique: true
    },
    average_rating: {
        type: Number,
        default: 0
    }
},{
    timestamps: true,
});

const subjectMessage = mongoose.model('subject', subjectSchema);

export default subjectMessage;