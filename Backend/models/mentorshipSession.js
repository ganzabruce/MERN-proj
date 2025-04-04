const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mentorshipSchema = new mongoose.Schema({
    mentorId: {
        type: String ,
        required: true
    },
    menteeId: {
        type: String,
        required: true
    } ,
    questions : {
        type: String,
        required:true,
    },
    menteeEmail: {
        type : String ,
        required: true,
    },
    status: {
        type : String,
        default: "pending" 
    }
})
const MentorshipSession = mongoose.model('MentorshipSession',mentorshipSchema)
module.exports = MentorshipSession