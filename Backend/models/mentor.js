const mongoose = require('mongoose');
const Schema = mongoose.Schema
const mentorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        maxlenght: 50,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        maxlenght: 50,
        trim: true
    },
    email: {
        type: String,
        require: true,
        maxlenght: 13,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    address:{
        type: String
    },
    bio: {
        type: String
    },
    occupation: {
        type :String
    },
    expertise : {
        type: String
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Mentor', mentorSchema);