const mongoose = require('mongoose');
const Schema = mongoose.Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        maxlenght: 13,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
)

module.exports = mongoose.model('User', userSchema);